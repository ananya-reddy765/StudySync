import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Video,
  BookOpen,
  Trophy,
  GraduationCap,
  User,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  // Safe user parsing
  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch {
    user = {};
  }

  const menus = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Groups",
      path: "/groups",
      icon: <Users size={20} />,
    },
    {
      title: "Study Rooms",
      path: "/study-rooms",
      icon: <Video size={20} />,
    },
    {
      title: "Resources",
      path: "/resources",
      icon: <BookOpen size={20} />,
    },
    {
      title: "Tutors",
      path: "/tutors",
      icon: <GraduationCap size={20} />,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: <User size={20} />,
    },
  ];

  // Show Admin menu only for admin users
  if (user?.role === "admin") {
    menus.push({
      title: "Admin",
      path: "/admin",
      icon: <ShieldCheck size={20} />,
    });
  }

  const handleQuestArena = () => {
    const lastGroupId =
      localStorage.getItem("lastGroupId");

    if (!lastGroupId) {
      alert(
        "Please open a group first to access Quest Arena."
      );

      navigate("/groups");
      return;
    }

    navigate(
      `/groups/${lastGroupId}/quest-arena`
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastGroupId");

    navigate("/login");
  };

  const isQuestArenaActive =
    window.location.pathname.includes(
      "/quest-arena"
    );

  return (
    <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col min-h-screen">

      <h1 className="text-3xl font-bold mb-12 text-slate-900">
        Study
        <span className="text-purple-500">
          Sync
        </span>
      </h1>

      <nav className="space-y-3 flex-1">

        {menus.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full p-4 rounded-xl transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            {item.icon}
            {item.title}
          </NavLink>
        ))}

        {/* Quest Arena */}
        <button
          onClick={handleQuestArena}
          className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all ${
            isQuestArenaActive
              ? "bg-purple-600 text-white shadow-lg"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Trophy size={20} />
          Quest Arena
        </button>

      </nav>

      {/* Logout */}
      <div className="border-t border-slate-200 pt-4 mt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-4 rounded-xl text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;