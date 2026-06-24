import User from "../models/User.js";
import Group from "../models/Group.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");

    let groupsJoined = 0;

    try {
      groupsJoined = await Group.countDocuments({
        members: req.user._id,
      });
    } catch (err) {
      console.log("Group count error:", err.message);
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      xp: user.xp || 0,
      level: user.level || 1,
      streak: user.streak || 0,
      badges: user.badges || [],
      tutorApproved: user.tutorApproved || false,

      groupsJoined,
      liveSessions: 0,
      questsCompleted: 0,
      studyStreak: user.streak || 0,

      bio: user.bio || "",
      college: user.college || "",

      recentActivity: [],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};