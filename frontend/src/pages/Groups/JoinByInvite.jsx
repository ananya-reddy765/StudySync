import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinGroupByToken } from "../../services/groupService";

const JoinByInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("joining"); // joining | success | error
  const [message, setMessage] = useState("");
  const [groupId, setGroupId] = useState(null);

  useEffect(() => {
    const join = async () => {
      try {
        const res = await joinGroupByToken(token);
        setGroupId(res.groupId);
        setMessage(res.message);
        setStatus("success");
        setTimeout(() => navigate(`/groups/${res.groupId}`), 2000);
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Invalid or expired invite link");
      }
    };

    join();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-10 text-center shadow-sm max-w-md w-full">

        {status === "joining" && (
          <>
            <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Joining group...</h2>
            <p className="text-gray-500">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">You're in!</h2>
            <p className="text-gray-500 mb-6">{message}. Redirecting to group...</p>
            <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to join</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/groups")}
                className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition"
              >
                Browse Groups
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Dashboard
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default JoinByInvite;