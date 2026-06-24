import {
  Users, Video, FileText,
  Brain, TrendingUp, MessageSquare,
  Shield, Zap,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Study Groups",
    desc: "Create or join groups for any subject. Invite friends with a unique link.",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: Video,
    title: "Live Study Rooms",
    desc: "Real-time video, whiteboard and chat — the digital library experience.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: FileText,
    title: "Resource Hub",
    desc: "Upload and share PDFs, notes and links with your group members.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Brain,
    title: "Peer Quizzing",
    desc: "Build flashcards and MCQ quizzes. Challenge your group and track scores.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    desc: "XP, streaks, badges and leaderboards to keep you motivated every day.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: MessageSquare,
    title: "Discussions",
    desc: "Threaded discussions for every group — ask questions, get answers.",
    color: "bg-teal-100 text-teal-600",
  },
  {
    icon: Shield,
    title: "Tutor Marketplace",
    desc: "Book verified tutors for 1-on-1 sessions. Simple, fast, affordable.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: Zap,
    title: "Instant Flashcards",
    desc: "Create and review flashcards on the go with spaced repetition.",
    color: "bg-orange-100 text-orange-600",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-violet-600">
            Features
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-3">
            Everything you need to study smarter
          </h2>
          <p className="text-gray-500 mt-4 text-lg">
            All the tools for collaborative learning, in one place.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                <feature.icon size={22} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;