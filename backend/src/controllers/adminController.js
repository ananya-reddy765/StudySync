import User from "../models/User.js";

export const getTutorRequests =
  async (req, res) => {
    try {
      const users =
        await User.find({
          tutorRequest: "pending",
        });

      res.json(users);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to load requests",
      });
    }
  };

export const approveTutor =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.isTutor = true;
      user.role = "tutor";
      user.tutorRequest = "approved";

      await user.save();

      res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Approval failed",
      });
    }
  };

export const rejectTutor =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.tutorRequest = "rejected";

      await user.save();

      res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Reject failed",
      });
    }
  };