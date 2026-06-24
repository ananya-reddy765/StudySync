import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-white pt-16 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Left: Text */}
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Study Together,
            <br />
            <span className="text-violet-600">Learn Better,</span>
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Grow Together
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
            Join study groups, solve quizzes, share resources and
            collaborate in real-time virtual rooms. Remote learning,
            reimagined.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-violet-200"
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="relative flex items-center justify-center">
          {/* Background blob */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-3xl" />

          <div className="relative z-10 p-8">
            <svg viewBox="0 0 420 380" className="w-full max-w-lg" fill="none">
              {/* Main card */}
              <rect x="30" y="40" width="360" height="280" rx="20" fill="white" opacity="0.9"/>
              <rect x="30" y="40" width="360" height="280" rx="20" stroke="#e5e7eb" strokeWidth="1"/>

              {/* Header bar */}
              <rect x="30" y="40" width="360" height="50" rx="20" fill="#7c3aed"/>
              <rect x="30" y="70" width="360" height="20" fill="#7c3aed"/>
              <circle cx="60" cy="65" r="8" fill="white" opacity="0.3"/>
              <rect x="80" y="60" width="80" height="10" rx="5" fill="white" opacity="0.5"/>
              <rect x="300" y="58" width="60" height="14" rx="7" fill="white" opacity="0.3"/>

              {/* Students row */}
              {[70, 140, 210, 280, 350].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy="130" r="22"
                    fill={["#fcd34d","#6ee7b7","#a5f3fc","#f9a8d4","#a78bfa"][i]}/>
                  <rect x={x-18} y="152" width="36" height="30" rx="8"
                    fill={["#f59e0b","#10b981","#06b6d4","#ec4899","#8b5cf6"][i]}
                    opacity="0.7"/>
                </g>
              ))}

              {/* Chat bubbles */}
              <rect x="55" y="195" width="140" height="32" rx="10" fill="#f3f4f6"/>
              <rect x="59" y="203" width="80" height="6" rx="3" fill="#9ca3af"/>
              <rect x="59" y="213" width="60" height="6" rx="3" fill="#d1d5db"/>

              <rect x="225" y="195" width="140" height="32" rx="10" fill="#ede9fe"/>
              <rect x="229" y="203" width="90" height="6" rx="3" fill="#8b5cf6"/>
              <rect x="229" y="213" width="70" height="6" rx="3" fill="#c4b5fd"/>

              {/* Bottom stats */}
              <rect x="50" y="242" width="80" height="55" rx="10" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1"/>
              <rect x="60" y="254" width="30" height="6" rx="3" fill="#d1d5db"/>
              <rect x="60" y="264" width="50" height="10" rx="3" fill="#7c3aed"/>
              <rect x="60" y="278" width="40" height="6" rx="3" fill="#e5e7eb"/>

              <rect x="170" y="242" width="80" height="55" rx="10" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1"/>
              <rect x="180" y="254" width="30" height="6" rx="3" fill="#d1d5db"/>
              <rect x="180" y="264" width="50" height="10" rx="3" fill="#7c3aed"/>
              <rect x="180" y="278" width="40" height="6" rx="3" fill="#e5e7eb"/>

              <rect x="290" y="242" width="80" height="55" rx="10" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1"/>
              <rect x="300" y="254" width="30" height="6" rx="3" fill="#d1d5db"/>
              <rect x="300" y="264" width="50" height="10" rx="3" fill="#7c3aed"/>
              <rect x="300" y="278" width="40" height="6" rx="3" fill="#e5e7eb"/>

              {/* Floating badges */}
              <rect x="320" y="10" width="90" height="32" rx="10" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
              <circle cx="336" cy="26" r="8" fill="#6ee7b7"/>
              <rect x="350" y="20" width="50" height="6" rx="3" fill="#d1d5db"/>
              <rect x="350" y="29" width="35" height="5" rx="2" fill="#e5e7eb"/>

              <rect x="10" y="150" width="90" height="32" rx="10" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
              <circle cx="26" cy="166" r="8" fill="#fcd34d"/>
              <rect x="40" y="160" width="50" height="6" rx="3" fill="#d1d5db"/>
              <rect x="40" y="169" width="35" height="5" rx="2" fill="#e5e7eb"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;