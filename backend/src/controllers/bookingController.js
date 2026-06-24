import Booking from "../models/Booking.js";

export const createBooking =
  async (req, res) => {
    try {
      const {
        tutorId,
        date,
        startTime,
        endTime,
      } = req.body;

      const existing =
        await Booking.findOne({
          tutor: tutorId,
          date,
          startTime,
          status: {
            $in: [
              "pending",
              "confirmed",
            ],
          },
        });

      if (existing) {
        return res.status(400).json({
          message:
            "This slot is already booked",
        });
      }

      const booking =
        await Booking.create({
          student: req.user._id,
          tutor: tutorId,
          date,
          startTime,
          endTime,
        });

      res.status(201).json(
        booking
      );
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message:
          "Booking failed",
      });
    }
  };