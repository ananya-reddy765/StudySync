import { Link } from "react-router-dom";

const GroupCard = ({ group }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

      <h2 className="text-xl font-bold">
        {group.name}
      </h2>

      <p className="text-slate-500 mt-3">
        {group.description}
      </p>

      <div className="mt-4 text-sm text-slate-400">
        {group.members?.length || 0}
        {" "}Members
      </div>

      <Link
        to={`/groups/${group._id}`}
        className="
          mt-5
          inline-block
          bg-purple-600
          text-white
          px-4
          py-2
          rounded-xl
        "
      >
        Open Group
      </Link>

    </div>
  );
};

export default GroupCard;