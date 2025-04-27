import { validationResult } from "express-validator";
import EventModel from "../models/EventModel.js";

export const createEvent = async (req, res) => {
  try {
    // Step 1: Handle Validation Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const groupedErrors = errors.array().reduce((acc, error) => {
        if (!acc[error.path]) acc[error.path] = [];
        acc[error.path].push(error.msg);
        return acc;
      }, {});

      return res.status(400).json({
        status: "failed",
        message: "Serverside Validation Error",
        error: groupedErrors,
      });
    }

    const { title, description, date, time, location, image, category } =
      req.body;

    // Step 2: Get user from auth middleware
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized. Please log in.",
        error: "User not authenticated",
      });
    }

    // Step 3: Create the event
    const newEvent = await EventModel.create({
      title,
      description,
      date,
      time,
      image,
      location,
      category,
      createdBy: userId,
    });

    return res.status(201).json({
      status: "success",
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (error) {
    console.error("Error in Create Event Controller:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const groupedErrors = errors.array().reduce((acc, error) => {
        if (!acc[error.path]) acc[error.path] = [];
        acc[error.path].push(error.msg);
        return acc;
      }, {});

      return res.status(400).json({
        status: "failed",
        message: "Serverside Validation Error",
        error: groupedErrors,
      });
    }

    const eventId = req.params.id;
    const userId = req.user?._id;
    const { title, description, date, time, image, location, category } =
      req.body;

    // Check if event exists
    const existingEvent = await EventModel.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({
        status: "failed",
        message: "Event not found",
        error: "Invalid event ID",
      });
    }

    // Only the creator can update the event
    if (existingEvent.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "failed",
        message: "Forbidden",
        error: "You are not authorized to update this event",
      });
    }

    // Update event
    existingEvent.title = title;
    existingEvent.description = description;
    existingEvent.date = date;
    existingEvent.time = time;
    existingEvent.location = location;
    existingEvent.category = category;
    existingEvent.image = image;

    const updatedEvent = await existingEvent.save();

    return res.status(200).json({
      status: "success",
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Error in Update Event Controller:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user?._id;

    // Check if event exists
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        status: "failed",
        message: "Event not found",
        error: "Invalid event ID",
      });
    }

    // Only the creator can delete the event
    if (event.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "failed",
        message: "Forbidden",
        error: "You are not authorized to delete this event",
      });
    }

    await EventModel.findByIdAndDelete(eventId);

    return res.status(200).json({
      status: "success",
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error in Delete Event Controller:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = parseInt(req.query.limit) || 6; // default to 6 events per page
    const skip = (page - 1) * limit;

    const total = await EventModel.countDocuments(); // total event count
    const totalPages = Math.ceil(total / limit);

    const events = await EventModel.find()
      .sort({ date: 1, time: 1 }) // upcoming events first
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: "success",
      message: "Events fetched successfully",
      data: events,
      pagination: {
        total,
        page,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error in Get All Events Controller:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getEventsByCategoryAndLocation = async (req, res) => {
  try {
    const { category, location } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const filter = {};

    if (category && category !== "null" && category.trim() !== "") {
      filter.category = category; // Exact match for category
    }

    if (location && location !== "null" && location.trim() !== "") {
      filter.location = { $regex: new RegExp(location, "i") }; // Partial match for location (case-insensitive)
    }


    const total = await EventModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    const events = await EventModel.find(filter)
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(limit);


    return res.status(200).json({
      status: "success",
      message: "Filtered events fetched successfully",
      data: events,
      pagination: {
        total,
        page,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error in Filtered Events Controller:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// export const getEventsByCategoryAndLocation = async (req, res) => {
//   try {
//     const { category, location } = req.query;

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 6;
//     const skip = (page - 1) * limit;

//     const filter = {};
//     if (category) filter.category = category;
//     if (location) {
//       filter.location = { $regex: new RegExp(location, "i") }; // case-insensitive
//     }
//     console.log(filter)
//     const total = await EventModel.countDocuments(filter);
//     const totalPages = Math.ceil(total / limit);
//     const hasMore = page < totalPages;

//     const events = await EventModel.find(filter)
//       .sort({ date: 1, time: 1 }) // upcoming first
//       .skip(skip)
//       .limit(limit);
//     console.log(events)
//     return res.status(200).json({
//       status: "success",
//       message: "Filtered events fetched successfully",
//       data: events,
//       pagination: {
//         total,
//         page,
//         totalPages,
//         hasMore,
//       },
//     });
//   } catch (error) {
//     console.error("Error in Filtered Events Controller:", error.message);
//     return res.status(500).json({
//       status: "failed",
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

export const getUserEvents = async (req, res) => {
  try {
    const userId = req.user._id; // comes from auth middleware

    const events = await EventModel.find({ createdBy: userId }).sort({
      date: 1,
      time: 1,
    });

    return res.status(200).json({
      status: "success",
      message: "User-created events fetched successfully",
      data: events,
    });
  } catch (error) {
    console.error("Error in Get User Events Controller:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await EventModel.findById(id);

    if (!event) {
      return res.status(404).json({
        status: "failed",
        message: "Event not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Event fetched successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error in Get Event By ID Controller:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const getUniqueCategories = async (req, res) => {
  try {
    const categories = await EventModel.distinct("category");

    return res.status(200).json({
      status: "success",
      message: "Unique categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error in Get Unique Categories Controller:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
