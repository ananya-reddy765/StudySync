import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            Study<span className="text-violet-600">Sync</span>
          </h1>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-violet-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-violet-600 transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-violet-600 transition-colors">Pricing</a>
          <a href="#about" className="hover:text-violet-600 transition-colors">About</a>
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex gap-3 items-center">
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          <a href="#features" className="text-gray-600 text-sm">Features</a>
          <a href="#how-it-works" className="text-gray-600 text-sm">How It Works</a>
          <Link to="/login" className="text-gray-600 text-sm">Login</Link>
          <Link
            to="/register"
            className="bg-violet-600 text-white text-sm text-center py-2 rounded-xl"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;