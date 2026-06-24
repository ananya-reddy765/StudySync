import {
  useEffect,
  useState,
} from "react";

import {
  getTutorRequests,
  approveTutor,
  rejectTutor,
} from "../../api/adminApi";

const AdminDashboard = () => {
  const [requests, setRequests] =
    useState([]);

  const loadRequests =
    async () => {
      try {
        const data =
          await getTutorRequests();

        setRequests(data);
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Tutor Requests
      </h1>

      <div className="space-y-4">

        {requests.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-2xl p-5 shadow-sm"
          >
            <h2 className="font-bold">
              {user.name}
            </h2>

            <p>{user.email}</p>

            <div className="flex gap-3 mt-4">

              <button
                onClick={async () => {
                  await approveTutor(
                    user._id
                  );

                  loadRequests();
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-xl"
              >
                Approve
              </button>

              <button
                onClick={async () => {
                  await rejectTutor(
                    user._id
                  );

                  loadRequests();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-xl"
              >
                Reject
              </button>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
};

export default AdminDashboard;