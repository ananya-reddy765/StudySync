import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* ── Left Panel ── */}
        <div className="bg-gradient-to-br from-violet-700 via-violet-800 to-indigo-900 p-10 flex flex-col justify-between relative overflow-hidden">

          {/* Background circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24" />

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-violet-700 font-bold text-sm">S</span>
              </div>
              <span className="text-white font-bold text-xl">StudySync</span>
            </div>
          </div>

          {/* Illustration — students studying */}
          <div className="relative z-10 flex-1 flex items-center justify-center py-8">
            <svg viewBox="0 0 400 320" className="w-full max-w-sm" fill="none">
              {/* Desk */}
              <rect x="40" y="220" width="320" height="12" rx="6" fill="#ffffff" opacity="0.2"/>
              {/* Left student */}
              <circle cx="110" cy="140" r="28" fill="#fcd34d"/>
              <rect x="82" y="168" width="56" height="55" rx="12" fill="#a78bfa"/>
              {/* Laptop left */}
              <rect x="70" y="200" width="80" height="50" rx="6" fill="#1e1b4b" opacity="0.8"/>
              <rect x="74" y="204" width="72" height="38" rx="4" fill="#4c1d95" opacity="0.9"/>
              <rect x="78" y="208" width="64" height="26" rx="2" fill="#7c3aed" opacity="0.7"/>
              {/* Screen glow lines */}
              <rect x="82" y="213" width="30" height="2" rx="1" fill="white" opacity="0.6"/>
              <rect x="82" y="218" width="40" height="2" rx="1" fill="white" opacity="0.4"/>
              <rect x="82" y="223" width="25" height="2" rx="1" fill="white" opacity="0.3"/>

              {/* Right student */}
              <circle cx="290" cy="130" r="28" fill="#f9a8d4"/>
              <rect x="262" y="158" width="56" height="65" rx="12" fill="#818cf8"/>
              {/* Book right */}
              <rect x="255" y="195" width="90" height="60" rx="6" fill="#f5f3ff" opacity="0.9"/>
              <rect x="260" y="200" width="38" height="50" rx="2" fill="#ddd6fe"/>
              <rect x="302" y="200" width="38" height="50" rx="2" fill="#ede9fe"/>
              <rect x="264" y="208" width="28" height="2" rx="1" fill="#7c3aed" opacity="0.5"/>
              <rect x="264" y="214" width="22" height="2" rx="1" fill="#7c3aed" opacity="0.4"/>
              <rect x="264" y="220" width="26" height="2" rx="1" fill="#7c3aed" opacity="0.3"/>
              <rect x="306" y="208" width="28" height="2" rx="1" fill="#7c3aed" opacity="0.5"/>
              <rect x="306" y="214" width="20" height="2" rx="1" fill="#7c3aed" opacity="0.4"/>
              <rect x="306" y="220" width="24" height="2" rx="1" fill="#7c3aed" opacity="0.3"/>

              {/* Middle student */}
              <circle cx="200" cy="120" r="30" fill="#6ee7b7"/>
              <rect x="170" y="150" width="60" height="72" rx="12" fill="#7c3aed"/>
              {/* Tablet middle */}
              <rect x="165" y="188" width="70" height="50" rx="8" fill="#1e1b4b" opacity="0.9"/>
              <rect x="169" y="192" width="62" height="38" rx="4" fill="#4338ca"/>
              {/* Chart on tablet */}
              <rect x="175" y="210" width="8" height="14" rx="2" fill="#a5f3fc" opacity="0.8"/>
              <rect x="187" y="204" width="8" height="20" rx="2" fill="#6ee7b7" opacity="0.8"/>
              <rect x="199" y="208" width="8" height="16" rx="2" fill="#fcd34d" opacity="0.8"/>
              <rect x="211" y="200" width="8" height="24" rx="2" fill="#f9a8d4" opacity="0.8"/>

              {/* Speech bubbles */}
              <rect x="120" y="85" width="60" height="28" rx="10" fill="white" opacity="0.9"/>
              <polygon points="130,113 140,113 135,122" fill="white" opacity="0.9"/>
              <rect x="126" y="93" width="30" height="3" rx="1" fill="#7c3aed" opacity="0.6"/>
              <rect x="126" y="100" width="40" height="3" rx="1" fill="#7c3aed" opacity="0.4"/>

              <rect x="230" y="72" width="60" height="28" rx="10" fill="white" opacity="0.9"/>
              <polygon points="255,100 265,100 260,109" fill="white" opacity="0.9"/>
              <rect x="236" y="80" width="35" height="3" rx="1" fill="#7c3aed" opacity="0.6"/>
              <rect x="236" y="87" width="25" height="3" rx="1" fill="#7c3aed" opacity="0.4"/>

              {/* Stars/sparkles */}
              <circle cx="60" cy="80" r="4" fill="#fcd34d" opacity="0.7"/>
              <circle cx="340" cy="100" r="3" fill="#a5f3fc" opacity="0.7"/>
              <circle cx="355" cy="60" r="5" fill="#fcd34d" opacity="0.5"/>
              <circle cx="48" cy="180" r="3" fill="#f9a8d4" opacity="0.6"/>
            </svg>
          </div>

          {/* Bottom text */}
          <div className="relative z-10">
            <h2 className="text-white text-2xl font-bold">Learn Together.</h2>
            <p className="text-violet-200 mt-1">Grow Together.</p>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-500 mt-1 mb-8">Sign in to continue your learning journey</p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-violet-600" />
                Remember me
              </label>
              <a href="#" className="text-violet-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          {/* Role hint */}
          <div className="mt-6 p-4 bg-violet-50 rounded-xl border border-violet-100">
            <p className="text-xs font-semibold text-violet-700 mb-2">Demo accounts:</p>
            <div className="space-y-1 text-xs text-violet-600">
              <p>🎓 Student — use your registered email</p>
              <p>📚 Tutor — must be approved by admin</p>
              <p>⚙️ Admin — contact system administrator</p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-violet-600 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;