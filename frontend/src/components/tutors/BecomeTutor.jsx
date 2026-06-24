import { useState } from "react";
import { createTutor } from "../../api/tutorApi";

const BecomeTutor = ({ refresh }) => {
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] =
    useState("");

  const [hourlyRate, setHourlyRate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createTutor({
        bio,
        expertise: expertise
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        hourlyRate: Number(hourlyRate),
      });

      alert(
        "Tutor profile created successfully"
      );

      setBio("");
      setExpertise("");
      setHourlyRate("");

      refresh();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to create tutor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm p-6"
    >
      <h2 className="text-xl font-bold mb-4">
        Become a Tutor
      </h2>

      <textarea
        placeholder="Tell students about yourself..."
        value={bio}
        onChange={(e) =>
          setBio(e.target.value)
        }
        className="w-full border rounded-xl p-3 mb-3"
        rows={4}
        required
      />

      <input
        type="text"
        placeholder="React, DSA, MongoDB"
        value={expertise}
        onChange={(e) =>
          setExpertise(e.target.value)
        }
        className="w-full border rounded-xl p-3 mb-3"
      />

      <input
        type="number"
        placeholder="Hourly Rate"
        value={hourlyRate}
        onChange={(e) =>
          setHourlyRate(e.target.value)
        }
        className="w-full border rounded-xl p-3 mb-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 text-white px-5 py-2 rounded-xl"
      >
        {loading
          ? "Creating..."
          : "Become Tutor"}
      </button>
    </form>
  );
};

export default BecomeTutor;