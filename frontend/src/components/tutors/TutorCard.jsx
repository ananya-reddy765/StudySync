import { Link } from "react-router-dom";

const TutorCard = ({ tutor }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
          {tutor?.user?.name?.charAt(0)}
        </div>

        <div>
          <h3 className="font-bold text-lg">
            {tutor?.user?.name}
          </h3>

          <p className="text-gray-500 text-sm">
            ⭐ {tutor?.rating || 5}
          </p>
        </div>

      </div>

      <p className="mt-4 text-gray-600">
        {tutor?.bio}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        {tutor?.expertise?.map(
          (skill, index) => (
            <span
              key={index}
              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          )
        )}
      </div>

      <div className="mt-5 text-xl font-bold text-purple-700">
        ₹{tutor?.hourlyRate}/hr
      </div>

      <Link
        to={`/tutors/${tutor._id}`}
        className="inline-block mt-4 bg-purple-600 text-white px-5 py-2 rounded-xl"
      >
        View Profile
      </Link>

    </div>
  );
};

export default TutorCard;