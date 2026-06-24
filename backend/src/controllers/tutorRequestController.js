import User from "../models/User.js";

export const requestTutorRole =
  async (req, res) => {
    try {
      const user =
        await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (user.tutorRequest === "pending") {
        return res.status(400).json({
          message:
            "Request already pending",
        });
      }

      user.tutorRequest = "pending";

      await user.save();

      res.json({
        success: true,
        message:
          "Tutor request submitted",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to submit request",
      });
    }
  };