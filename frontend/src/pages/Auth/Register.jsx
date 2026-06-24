import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

const ROLES = [
  {
    id: "student",
    label: "Student",
    emoji: "🎓",
    desc: "Join groups, take quizzes, learn together",
  },
  {
    id: "tutor",
    label: "Tutor",
    emoji: "📚",
    desc: "Teach students, create listings, earn money",
  },
];

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [formData, setFormData] = useState({
    name:     "",
    email:    "",
    password: "",
    role:     "student",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    setLoading(true);
    setError("");
    try {
      await registerUser(formData);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* ── Left Panel ── */}
        <div className="bg-gradient-to-br from-violet-700 via-violet-800 to-indigo-900 p-10 flex flex-col justify-between relative overflow-hidden">

          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24" />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-violet-700 font-bold text-sm">S</span>
            </div>
            <span className="text-white font-bold text-xl">StudySync</span>
          </div>

          {/* Illustration */}
          <div className="relative z-10 flex-1 flex items-center justify-center py-6">
            <svg viewBox="0 0 360 300" className="w-full max-w-xs" fill="none">
              {/* Graduation cap */}
              <ellipse cx="180" cy="95" rx="70" ry="12" fill="white" opacity="0.15"/>
              <rect x="145" y="68" width="70" height="8" rx="4" fill="white" opacity="0.3"/>
              <polygon points="180,45 250,75 180,95 110,75" fill="white" opacity="0.25"/>
              <rect x="245" y="75" width="4" height="35" rx="2" fill="white" opacity="0.3"/>
              <circle cx="247" cy="113" r="6" fill="#fcd34d" opacity="0.8"/>

              {/* Person */}
              <circle cx="180" cy="148" r="30" fill="#a78bfa"/>
              <rect x="150" y="178" width="60" height="70" rx="14" fill="#7c3aed"/>
              {/* Arms */}
              <rect x="120" y="182" width="32" height="14" rx="7" fill="#7c3aed"/>
              <rect x="208" y="182" width="32" height="14" rx="7" fill="#7c3aed"/>
              {/* Diploma scroll */}
              <rect x="215" y="178" width="40" height="28" rx="6" fill="#fef3c7"/>
              <rect x="219" y="184" width="28" height="2" rx="1" fill="#f59e0b" opacity="0.7"/>
              <rect x="219" y="189" width="20" height="2" rx="1" fill="#f59e0b" opacity="0.5"/>
              <rect x="219" y="194" width="24" height="2" rx="1" fill="#f59e0b" opacity="0.4"/>
              <circle cx="247" cy="198" r="5" fill="#fcd34d"/>

              {/* Stars */}
              <circle cx="80"  cy="80"  r="5" fill="#fcd34d" opacity="0.7"/>
              <circle cx="280" cy="70"  r="4" fill="#a5f3fc" opacity="0.7"/>
              <circle cx="295" cy="130" r="6" fill="#fcd34d" opacity="0.5"/>
              <circle cx="65"  cy="160" r="4" fill="#f9a8d4" opacity="0.6"/>
              <circle cx="310" cy="200" r="3" fill="#6ee7b7" opacity="0.7"/>

              {/* Books stack */}
              <rect x="75" y="220" width="60" height="12" rx="4" fill="#6ee7b7" opacity="0.7"/>
              <rect x="80" y="210" width="50" height="12" rx="4" fill="#a5f3fc" opacity="0.7"/>
              <rect x="85" y="200" width="40" height="12" rx="4" fill="#fcd34d" opacity="0.7"/>

              {/* Checkmarks */}
              <circle cx="290" cy="230" r="18" fill="white" opacity="0.15"/>
              <path d="M282 230 L288 236 L300 222" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
            </svg>
          </div>

          <div className="relative z-10">
            <h2 className="text-white text-2xl font-bold">Join StudySync</h2>
            <p className="text-violet-200 mt-1">Start your learning journey today</p>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="p-10 flex flex-col justify-center overflow-y-auto">
          <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 mt-1 mb-6">Fill in your details to get started</p>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">I want to join as:</p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.id })}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    formData.role === role.id
                      ? "border-violet-600 bg-violet-50"
                      : "border-gray-200 hover:border-violet-300"
                  }`}
                >
                  <div className="text-xl mb-1">{role.emoji}</div>
                  <div className="font-semibold text-sm text-gray-800">{role.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{role.desc}</div>
                </button>
              ))}
            </div>
            {formData.role === "tutor" && (
              <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mt-2 border border-amber-200">
                ⚠️ Tutor accounts require admin approval before you can create listings.
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>

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
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
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
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;