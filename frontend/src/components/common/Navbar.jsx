import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-10 py-5">

      <h1 className="text-3xl font-bold">
        Study<span className="text-purple-500">Sync</span>
      </h1>

      <div className="flex gap-8 text-gray-300">

        <a href="#features">Features</a>

        <a href="#how">How It Works</a>

        <a href="#about">About</a>

      </div>

      <div className="flex gap-4">

        <Link
          to="/login"
          className="border border-purple-500 px-4 py-2 rounded-lg"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-purple-600 px-4 py-2 rounded-lg"
        >
          Get Started
        </Link>

      </div>
    </nav>
  );
};

export default Navbar;