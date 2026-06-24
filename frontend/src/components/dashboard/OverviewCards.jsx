import {
  Users,
  Trophy,
  Video,
} from "lucide-react";

const OverviewCards = ({ overview = {} }) => {
  const cards = [
    {
      title: "Groups Joined",
      value: overview.groupsJoined || 0,
      icon: <Users size={22} />,
    },
    {
      title: "Quests Completed",
      value: overview.questsCompleted || 0,
      icon: <Trophy size={22} />,
    },
    {
      title: "Study Rooms",
      value: overview.studyRoomsJoined || 0,
      icon: <Video size={22} />,
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            shadow-sm
            p-6
            hover:shadow-md
            transition-all
          "
        >
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm font-medium">
              {card.title}
            </span>

            <div className="text-purple-600">
              {card.icon}
            </div>
          </div>

          <h2 className="text-4xl font-bold text-slate-900 mt-4">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;