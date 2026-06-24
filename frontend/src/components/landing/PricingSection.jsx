import { Check } from "lucide-react";
import { Link } from "react-router-dom";

// NOTE: prices below are placeholders — update to your actual pricing before launch.
const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Get started with the basics, no card required.",
    features: [
      "Up to 2 study groups",
      "Resource Hub access",
      "Basic flashcards",
      "Group discussions",
    ],
    cta: "Get Started Free",
    to: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/mo",
    description: "The full collaborative toolkit for serious study groups.",
    features: [
      "Unlimited study groups",
      "Live study rooms & whiteboard",
      "Peer quizzing & MCQ builder",
      "Progress tracking (XP, streaks, badges)",
      "Unlimited flashcards",
    ],
    cta: "Start Pro",
    to: "/register",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$19",
    period: "/mo",
    description: "For classes, tutoring groups, or larger cohorts.",
    features: [
      "Everything in Pro",
      "Tutor Marketplace access",
      "Group-wide progress overview",
      "Priority support",
    ],
    cta: "Contact Us",
    to: "/register",
    highlighted: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold tracking-widest uppercase text-violet-600">
          Pricing
        </span>
        <h2 className="text-4xl font-extrabold text-gray-900 mt-3">
          Simple pricing, for every group size
        </h2>
        <p className="text-gray-500 mt-4">
          Start free. Upgrade when your group needs more.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-8 border transition-shadow ${
              plan.highlighted
                ? "border-violet-600 bg-white shadow-xl md:-translate-y-3"
                : "border-gray-200 bg-white hover:shadow-md"
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
            <p className="text-gray-500 text-sm mt-1 min-h-[40px]">{plan.description}</p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
              <span className="text-gray-500 text-sm">{plan.period}</span>
            </div>

            <Link
              to={plan.to}
              className={`mt-6 block text-center px-5 py-3 rounded-xl font-semibold text-sm transition-colors ${
                plan.highlighted
                  ? "bg-violet-600 hover:bg-violet-700 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {plan.cta}
            </Link>

            <ul className="mt-8 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-violet-600 mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;