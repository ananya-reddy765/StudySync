import {
  requestTutorRole,
} from "../../api/adminApi";

const TutorRequest = () => {
  const handleRequest =
    async () => {
      try {
        await requestTutorRole();

        alert(
          "Tutor request submitted!"
        );
      } catch (error) {
        console.error(error);

        alert(
          error?.response?.data
            ?.message ||
            "Request failed"
        );
      }
    };

  return (
    <div className="p-8">

      <div className="bg-white rounded-3xl p-8 shadow-sm">

        <h1 className="text-3xl font-bold">
          Become a Tutor
        </h1>

        <p className="text-gray-500 mt-3">
          Submit your request to
          become a verified tutor.
        </p>

        <button
          onClick={handleRequest}
          className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-xl"
        >
          Request Tutor Role
        </button>

      </div>

    </div>
  );
};

export default TutorRequest;