import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { joinGroup } from "../../services/groupService";

const JoinViaLink = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("joining");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!inviteCode) {
      setStatus("error");
      setMessage("Invalid invite link.");
      return;
    }

    let mounted = true;

    const join = async () => {
      try {
        const data = await joinGroup(
          inviteCode.toUpperCase()
        );

        if (!mounted) return;

        setStatus("success");

        setTimeout(() => {
          navigate(
            `/groups/${data?.groupId || data?._id}`
          );
        }, 1500);
      } catch (err) {
        if (!mounted) return;

        setStatus("error");

        setMessage(
          err?.response?.data?.message ||
            "Invalid or expired invite link."
        );
      }
    };

    join();

    return () => {
      mounted = false;
    };
  }, [inviteCode, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-10 max-w-md w-full text-center">

        <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-100 flex items-center justify-center mb-5">
          <Users
            size={28}
            className="text-violet-600"
          />
        </div>

        {status === "joining" && (
          <>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Joining Group...
            </h2>

            <p className="text-slate-500">
              Please wait while we add you to the study group.
            </p>

            <div className="flex justify-center mt-6">
              <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-xl font-bold text-green-600 mb-2">
              Successfully Joined 🎉
            </h2>

            <p className="text-slate-500">
              Redirecting you to the group...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Could Not Join
            </h2>

            <p className="text-slate-500 mb-6">
              {message}
            </p>

            <button
              onClick={() => navigate("/groups")}
              className="px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition"
            >
              Go To Groups
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default JoinViaLink;