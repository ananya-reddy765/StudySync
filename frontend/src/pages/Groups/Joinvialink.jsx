import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinGroup } from "../../services/groupService";
import { Users } from "lucide-react";

export default function JoinViaLink() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("joining"); // joining | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const join = async () => {
      try {
        const data = await joinGroup(inviteCode.toUpperCase());
        setStatus("success");
        setTimeout(() => navigate(`/groups/${data.groupId}`), 1500);
      } catch (err) {
        const msg = err.response?.data?.message || "Invalid or expired invite link.";
        setStatus("error");
        setMessage(msg);
      }
    };
    join();
  }, [inviteCode, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-sm w-full text-center">
        <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Users className="text-violet-600" size={26} />
        </div>

        {status === "joining" && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Joining group...
            </h2>
            <p className="text-sm text-gray-400">
              Please wait while we add you to the group.
            </p>
            <div className="mt-5 flex justify-center">
              <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-lg font-semibold text-green-700 mb-2">
              Joined successfully!
            </h2>
            <p className="text-sm text-gray-400">Redirecting to your group...</p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              Could not join
            </h2>
            <p className="text-sm text-gray-500 mb-5">{message}</p>
            <button
              onClick={() => navigate("/groups")}
              className="px-5 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition"
            >
              Browse Groups
            </button>
          </>
        )}
      </div>
    </div>
  );
}