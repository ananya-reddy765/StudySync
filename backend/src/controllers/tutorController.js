import Tutor from "../models/Tutor.js";

export const getTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find()
      .populate("user", "name email");

    res.json(tutors);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch tutors",
    });
  }
};

export const getTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findById(
      req.params.id
    ).populate("user", "name email");

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    res.json(tutor);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch tutor",
    });
  }
};

export const createTutor = async (
  req,
  res
) => {
  try {
    const existingTutor =
      await Tutor.findOne({
        user: req.user._id,
      });

    if (existingTutor) {
      return res.status(400).json({
        message:
          "You already have a tutor profile",
      });
    }

    const tutor = await Tutor.create({
      user: req.user._id,
      bio: req.body.bio,
      expertise: req.body.expertise,
      hourlyRate: req.body.hourlyRate,
    });

    res.status(201).json(tutor);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create tutor",
    });
  }
};