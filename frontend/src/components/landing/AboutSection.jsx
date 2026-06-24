import { Users, ShieldCheck, Sparkles } from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Built for real groups",
    desc: "Designed around how study groups actually work together, not solo flashcard drilling.",
  },
  {
    icon: ShieldCheck,
    title: "Your content stays yours",
    desc: "Notes, quizzes and resources you upload belong to you and your group, not a feed.",
  },
  {
    icon: Sparkles,
    title: "Built by students",
    desc: "StudySync is shaped by the tools we wished existed for our own study groups.",
  },
];

const AboutSection = () => (
  <section id="about" className="py-24 bg-white">
    <div className="max-w-5xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold tracking-widest uppercase text-violet-600">
          About
        </span>
        <h2 className="text-4xl font-extrabold text-gray-900 mt-3">
          Why we built StudySync
        </h2>
      </div>

      <div className="max-w-3xl mx-auto text-gray-600 leading-relaxed space-y-4 mb-16">
        <p>
          Studying alone is hard to stay consistent with, and most tools weren't built
          for the back-and-forth of real group work: sharing notes, quizzing each other,
          and actually showing up at the same time.
        </p>
        <p>
          StudySync brings that into one place — live study rooms, a shared resource hub,
          peer-made quizzes, and lightweight progress tracking — so a group can coordinate
          without juggling five different apps.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {values.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="text-center p-6 rounded-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
              <Icon size={22} className="text-violet-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;