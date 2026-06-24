import { useEffect, useState } from "react";

import BecomeTutor from "../../components/tutors/BecomeTutor";
import TutorCard from "../../components/tutors/TutorCard";

import { getTutors } from "../../api/tutorApi";

const TutorMarketplace = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTutors = async () => {
    try {
      const data = await getTutors();
      setTutors(data || []);
    } catch (err) {
      console.error(err);
      setTutors([]);
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

      <BecomeTutor refresh={fetchTutors} />

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