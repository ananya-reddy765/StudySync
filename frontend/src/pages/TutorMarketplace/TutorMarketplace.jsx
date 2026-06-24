import { useEffect, useState } from "react";

import BecomeTutor from "../../components/tutors/BecomeTutor";
import TutorCard from "../../components/tutors/TutorCard";

import { getTutors } from "../../api/tutorApi";

const TutorMarketplace = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myTutor, setMyTutor] = useState(null);

  const fetchTutors = async () => {
    try {
      setLoading(true);

      const data = await getTutors();

      const tutorList = Array.isArray(data)
        ? data
        : [];

      setTutors(tutorList);

      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        const existingTutor =
          tutorList.find(
            (t) =>
              t.user?._id === user?._id
          );

        setMyTutor(existingTutor || null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  return (
    <div className="p-8 space-y-6">

      <div className="bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white rounded-3xl p-8">
        <h1 className="text-3xl font-bold">
          Tutor Marketplace
        </h1>

        <p className="mt-2 opacity-90">
          Learn directly from verified tutors
        </p>
      </div>

      {myTutor ? (
        <div className="bg-green-50 border border-green-300 rounded-2xl p-6">
          <h2 className="font-bold text-green-700">
            ✓ You are already a Tutor
          </h2>

          <p className="text-green-600 mt-2">
            Students can now book sessions
            with you.
          </p>
        </div>
      ) : (
        <BecomeTutor refresh={fetchTutors} />
      )}

      {loading ? (
        <div className="bg-white rounded-2xl p-6">
          Loading tutors...
        </div>
      ) : tutors.length === 0 ? (
        <div className="bg-white rounded-2xl p-6">
          No tutors available yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <TutorCard
              key={tutor._id}
              tutor={tutor}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default TutorMarketplace;