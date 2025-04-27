import { body } from "express-validator";

const eventValidation = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("category").notEmpty().withMessage("Category is required"),
  
    // Validate Date
    body("date")
      .notEmpty().withMessage("Date is required")
      .isISO8601().withMessage("Date must be in a valid format (YYYY-MM-DD)")
      .custom((value) => {
        const inputDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // ignore time
        if (inputDate < today) {
          throw new Error("Date must not be in the past");
        }
        return true;
      }),
  
    // Validate Time
    body("time")
      .notEmpty().withMessage("Time is required")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("Time must be in HH:MM format")
      .custom((value, { req }) => {
        const eventDate = new Date(req.body.date);
        const now = new Date();
  
        // Combine date and time to a Date object
        const [hours, minutes] = value.split(":").map(Number);
        eventDate.setHours(hours, minutes, 0, 0);
  
        if (eventDate < now) {
          throw new Error("Event time must be in the future");
        }
        return true;
      }),
  ];

export default eventValidation;