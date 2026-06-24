import { useEffect, useState } from "react";
import {
  Pencil,
  Mail,
  School,
  Users,
  Video,
  Trophy,
  Flame,
  Loader2,
  Shield,
  Award,
  Star,
} from "lucide-react";

import EditProfileModal from "../../components/profile/EditProfileModal";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../api/authApi";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();
        const profileData =
          response?.user ||
          response?.data?.user ||
          response?.data;
        if (profileData) {
          updateUser(profileData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  const stats = [
    {
      title: "Groups Joined",
      value: user?.groupsJoined || 0,
      icon: <Users size={18} />,
    },
    {
      title: "Live Sessions",
      value: user?.liveSessions || 0,
      icon: <Video size={18} />,
    },
    {
      title: "Quests Completed",
      value: user?.questsCompleted || 0,
      icon: <Trophy size={18} />,
    },
    {
      title: "Study Streak",
      value: user?.streak || 0,
      icon: <Flame size={18} />,
    },
  ];

  return (
    <div className="p-8 space-y-6">

      {/* HERO */}
      <div className="bg-gradient-to-r from-purple-700 to-fuchsia-600 rounded-3xl p-8 text-white">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-2 opacity-90">
          Track your learning journey and achievements.
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {initials}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{user?.name}</h2>
              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <Mail size={16} />
                {user?.email}
              </div>
              {user?.college && (
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <School size={16} />
                  {user.college}
                </div>
              )}
              <div className="mt-3">
                {user?.role === "admin" && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit">
                    <Shield size={14} />
                    Admin
                  </span>
                )}
                {user?.role === "tutor" && (
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                    Tutor
                  </span>
                )}
                {user?.role === "student" && (
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                    Student
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowEdit(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        </div>

        <div className="border-t mt-6 pt-6">
          <h3 className="font-bold mb-2">About Me</h3>
          <p className="text-gray-600">{user?.bio || "No bio added yet."}</p>
        </div>
      </div>

      {/* XP / LEVEL / BADGES */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-gray-500">XP Points</p>
          <h2 className="text-4xl font-bold text-purple-600">
            {user?.xp || 0}
          </h2>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-gray-500">Level</p>
          <h2 className="text-4xl font-bold text-purple-600">
            {user?.level || 1}
          </h2>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-gray-500">Badges Earned</p>
          <h2 className="text-4xl font-bold text-purple-600">
            {user?.badges?.length || 0}
          </h2>
        </div>
      </div>

      {/* ACTIVITY */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-5">Activity Overview</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className="border rounded-2xl p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-2 text-gray-600">
                {item.icon}
                {item.title}
              </div>
              <span className="font-bold text-xl">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BADGES */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
          <Award size={20} />
          Achievements
        </h2>
        <div className="flex flex-wrap gap-3">
          {user?.badges?.length ? (
            user.badges.map((badge, index) => (
              <div
                key={index}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full flex items-center gap-2"
              >
                <Star size={15} />
                {badge}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No badges earned yet.</p>
          )}
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-5">Recent Activity</h2>
        {user?.recentActivity?.length ? (
          <ul className="space-y-3">
            {user.recentActivity.map((activity, index) => (
              <li key={index} className="border rounded-xl p-3">
                {activity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent activity available.</p>
        )}
      </div>

      {showEdit && (
        <EditProfileModal onClose={() => setShowEdit(false)} />
      )}

    </div>
  );
};

export default Profile;