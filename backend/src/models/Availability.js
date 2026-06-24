import mongoose from "mongoose";

const availabilitySchema =
  new mongoose.Schema(
    {
      tutor: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Tutor",
        required: true,
      },

      date: {
        type: Date,
        required: true,
      },

      startTime: {
        type: String,
        required: true,
      },

      endTime: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Availability",
  availabilitySchema
);