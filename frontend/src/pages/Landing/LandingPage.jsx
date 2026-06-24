import Navbar          from "../../components/landing/Navbar";
import HeroSection     from "../../components/landing/HeroSection";
import FeaturesSection from "../../components/landing/FeaturesSection";
import PricingSection  from "../../components/landing/PricingSection";
import AboutSection    from "../../components/landing/AboutSection";
import Footer          from "../../components/landing/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold tracking-widest uppercase text-violet-600">
          How It Works
        </span>
        <h2 className="text-4xl font-extrabold text-gray-900 mt-3">
          Get started in 3 simple steps
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { step: "01", title: "Create Account", desc: "Sign up free as a student or tutor in under 60 seconds.", emoji: "✍️" },
          { step: "02", title: "Join or Create Groups", desc: "Find study groups for your subjects or create your own and invite friends.", emoji: "👥" },
          { step: "03", title: "Study Together", desc: "Use live rooms, quizzes, whiteboards and chat to collaborate in real time.", emoji: "🚀" },
        ].map((item) => (
          <div key={item.step} className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">{item.emoji}</div>
            <div className="text-xs font-bold text-violet-600 tracking-widest mb-2">STEP {item.step}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-24 bg-gradient-to-br from-violet-700 to-indigo-800">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <h2 className="text-4xl font-extrabold text-white mb-4">
        Ready to study smarter?
      </h2>
      <p className="text-violet-200 text-lg mb-10">
        Join thousands of students already using StudySync to ace their exams.
      </p>
      <Link
        to="/register"
        className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-xl"
      >
        Get Started Free
        <ArrowRight size={18} />
      </Link>
    </div>
  </section>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;