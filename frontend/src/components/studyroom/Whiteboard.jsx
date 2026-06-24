// src/components/studyroom/Whiteboard.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import socket from "../../lib/socket";
import {
  Pencil, Eraser, Trash2, Download, Minus, Plus,
  Square, Circle, Minus as LineIcon, ChevronDown,
} from "lucide-react";

const COLORS = [
  "#ffffff", "#f87171", "#fb923c", "#facc15",
  "#4ade80", "#60a5fa", "#a78bfa", "#f472b6",
  "#94a3b8", "#000000",
];

const TOOLS = [
  { id: "pen",    icon: Pencil,   label: "Pen" },
  { id: "eraser", icon: Eraser,   label: "Eraser" },
  { id: "line",   icon: LineIcon, label: "Line" },
  { id: "rect",   icon: Square,   label: "Rectangle" },
  { id: "circle", icon: Circle,   label: "Circle" },
];

const Whiteboard = ({ roomId }) => {
  const canvasRef      = useRef(null);
  const overlayRef     = useRef(null); // for shape previews
  const drawing        = useRef(false);
  const lastPos        = useRef(null);
  const shapeStart     = useRef(null);
  const snapshotRef    = useRef(null); // canvas snapshot before shape draw

  const [tool,  setTool]  = useState("pen");
  const [color, setColor] = useState("#ffffff");
  const [size,  setSize]  = useState(4);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // ── Canvas helpers ──────────────────────────────────────────────────────────
  const getCtx    = () => canvasRef.current?.getContext("2d");
  const getPos    = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * (canvasRef.current.width  / rect.width),
      y: (src.clientY - rect.top)  * (canvasRef.current.height / rect.height),
    };
  };

  // ── Resize canvas to parent ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas  = canvasRef.current;
    const overlay = overlayRef.current;
    const resize  = () => {
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      // Save image data, resize, restore
      const ctx  = canvas.getContext("2d");
      const img  = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width  = w;
      canvas.height = h;
      overlay.width  = w;
      overlay.height = h;
      ctx.putImageData(img, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, []);

  // ── Draw helpers ────────────────────────────────────────────────────────────
  const drawStroke = useCallback((ctx, from, to, c, s) => {
    ctx.strokeStyle = c;
    ctx.lineWidth   = s;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x,   to.y);
    ctx.stroke();
  }, []);

  const drawShape = useCallback((ctx, type, start, end, c, s, fill = false) => {
    ctx.strokeStyle = c;
    ctx.lineWidth   = s;
    ctx.lineCap     = "round";
    if (type === "line") {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x,   end.y);
      ctx.stroke();
    } else if (type === "rect") {
      ctx.beginPath();
      ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
      ctx.stroke();
    } else if (type === "circle") {
      const rx = (end.x - start.x) / 2;
      const ry = (end.y - start.y) / 2;
      ctx.beginPath();
      ctx.ellipse(start.x + rx, start.y + ry, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, []);

  // ── Socket events ───────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = getCtx();

    const onDrawStart = ({ x, y, color: c, size: s }) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const onDraw = ({ from, to, color: c, size: s, tool: t, shapeStart: ss, shapeEnd: se }) => {
      if (t === "pen" || t === "eraser") {
        ctx.globalCompositeOperation = t === "eraser" ? "destination-out" : "source-over";
        drawStroke(ctx, from, to, c, s);
        ctx.globalCompositeOperation = "source-over";
      } else if (ss && se) {
        // shapes are committed on draw-end via a full repaint from snapshot
        // intermediate previews are local only; remote clients get final shape
        drawShape(ctx, t, ss, se, c, s);
      }
    };

    const onClear = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    // Replay history when joining late
    const onHistory = (strokes) => {
      strokes.forEach((s) => {
        if (s.type === "draw") {
          if (s.tool === "pen" || s.tool === "eraser") {
            ctx.globalCompositeOperation = s.tool === "eraser" ? "destination-out" : "source-over";
            drawStroke(ctx, s.from, s.to, s.color, s.size);
            ctx.globalCompositeOperation = "source-over";
          } else if (s.shapeStart && s.shapeEnd) {
            drawShape(ctx, s.tool, s.shapeStart, s.shapeEnd, s.color, s.size);
          }
        }
      });
    };

    socket.on("draw-start", onDrawStart);
    socket.on("draw",       onDraw);
    socket.on("clear-board",onClear);
    socket.on("draw-history", onHistory);

    return () => {
      socket.off("draw-start", onDrawStart);
      socket.off("draw",       onDraw);
      socket.off("clear-board",onClear);
      socket.off("draw-history", onHistory);
    };
  }, [drawStroke, drawShape]);

  // ── Pointer handlers ────────────────────────────────────────────────────────
  const startDraw = (e) => {
    e.preventDefault();
    drawing.current  = true;
    const pos        = getPos(e);
    lastPos.current  = pos;
    shapeStart.current = pos;

    if (tool === "pen" || tool === "eraser") {
      socket.emit("draw-start", { roomId, data: { x: pos.x, y: pos.y, color, size } });
    } else {
      // take snapshot of canvas for live shape preview
      snapshotRef.current = getCtx().getImageData(
        0, 0, canvasRef.current.width, canvasRef.current.height
      );
    }
  };

  const moveDraw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const pos = getPos(e);
    const ctx = getCtx();

    if (tool === "pen" || tool === "eraser") {
      const comp = tool === "eraser" ? "destination-out" : "source-over";
      ctx.globalCompositeOperation = comp;
      drawStroke(ctx, lastPos.current, pos, color, size);
      ctx.globalCompositeOperation = "source-over";

      socket.emit("draw", {
        roomId,
        data: { from: lastPos.current, to: pos, color, size, tool },
      });
      lastPos.current = pos;
    } else {
      // Live shape preview on overlay canvas
      const ovCtx = overlayRef.current.getContext("2d");
      ovCtx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
      drawShape(ovCtx, tool, shapeStart.current, pos, color, size);
    }
  };

  const endDraw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    drawing.current = false;

    if (tool !== "pen" && tool !== "eraser") {
      const pos = lastPos.current;
      const se  = getPos(e);
      const ctx = getCtx();
      const ovCtx = overlayRef.current.getContext("2d");

      // Commit shape to main canvas
      drawShape(ctx, tool, shapeStart.current, se, color, size);
      ovCtx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);

      socket.emit("draw", {
        roomId,
        data: {
          from: shapeStart.current, to: se, color, size, tool,
          shapeStart: shapeStart.current, shapeEnd: se,
        },
      });
    }
    socket.emit("draw-end", { roomId });
  };

  const clearBoard = () => {
    getCtx().clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socket.emit("clear-board", roomId);
  };

  const downloadBoard = () => {
    const link    = document.createElement("a");
    link.download = "whiteboard.png";
    link.href     = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl h-full min-h-[520px]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-slate-700/60 bg-slate-800/80">
        {/* Tools */}
        <div className="flex gap-1 bg-slate-700/60 rounded-xl p-1">
          {TOOLS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              title={label}
              onClick={() => setTool(id)}
              className={`p-2 rounded-lg transition ${
                tool === id
                  ? "bg-purple-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-600/50"
              }`}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>

        {/* Color picker */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker((v) => !v)}
            className="flex items-center gap-1.5 bg-slate-700/60 hover:bg-slate-700 px-2 py-2 rounded-xl transition"
          >
            <span
              className="w-5 h-5 rounded-full border-2 border-slate-500"
              style={{ background: color }}
            />
            <ChevronDown size={12} className="text-slate-400" />
          </button>
          {showColorPicker && (
            <div className="absolute top-10 left-0 z-50 bg-slate-800 border border-slate-700 rounded-xl p-2 grid grid-cols-5 gap-1.5 shadow-2xl">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => { setColor(c); setShowColorPicker(false); }}
                  className="w-6 h-6 rounded-full border-2 transition hover:scale-110"
                  style={{
                    background: c,
                    borderColor: color === c ? "#a855f7" : "transparent",
                  }}
                />
              ))}
              {/* Custom color */}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-6 h-6 rounded-full cursor-pointer border-0 bg-transparent"
                title="Custom color"
              />
            </div>
          )}
        </div>

        {/* Brush size */}
        <div className="flex items-center gap-1.5 bg-slate-700/60 rounded-xl px-2 py-1.5">
          <button
            onClick={() => setSize((s) => Math.max(1, s - 2))}
            className="text-slate-400 hover:text-white transition"
          >
            <Minus size={13} />
          </button>
          <span className="text-xs text-slate-300 w-4 text-center font-mono">{size}</span>
          <button
            onClick={() => setSize((s) => Math.min(40, s + 2))}
            className="text-slate-400 hover:text-white transition"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Size preview */}
        <div className="flex items-center justify-center w-8 h-8">
          <div
            className="rounded-full bg-white"
            style={{ width: Math.min(size, 28), height: Math.min(size, 28) }}
          />
        </div>

        <div className="ml-auto flex gap-2">
          <button
            onClick={downloadBoard}
            title="Download"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-700/60 hover:bg-slate-700 px-3 py-2 rounded-xl transition"
          >
            <Download size={13} /> Save
          </button>
          <button
            onClick={clearBoard}
            title="Clear board"
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-slate-700/60 hover:bg-red-900/30 px-3 py-2 rounded-xl transition"
          >
            <Trash2 size={13} /> Clear
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        className="relative flex-1 bg-slate-900 cursor-crosshair"
        onClick={() => showColorPicker && setShowColorPicker(false)}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          onMouseDown={startDraw}
          onMouseMove={moveDraw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={moveDraw}
          onTouchEnd={endDraw}
          style={{ touchAction: "none" }}
        />
        {/* Shape preview overlay */}
        <canvas
          ref={overlayRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>
    </div>
  );
};

export default Whiteboard;