import express from "express";
const router = express.Router();
import { checkAuth, login, logout, registration, uploadDataToCloud } from "../app/controllers/AuthControllers.js";
import formValidator from "../app/middlewares/FormValidatorMiddleware.js";
import { isLoggedIn } from "../app/middlewares/AuthMiddleware.js";
import eventValidation from "../app/middlewares/EventValidatorMiddleware.js";
import { createEvent, deleteEvent, getAllEvents, getEventById, getEventsByCategoryAndLocation, getUniqueCategories, getUserEvents, updateEvent } from "../app/controllers/EventController.js";

//Authentication
router.post("/register",formValidator,registration);
router.post("/login",formValidator,login);
router.post("/uploadfile",isLoggedIn,uploadDataToCloud);
router.get("/logout",isLoggedIn,logout);
router.get("/check-auth",isLoggedIn,checkAuth);

//Event 
router.post("/create-event",isLoggedIn,eventValidation,createEvent);
router.post("/update-event/:id", isLoggedIn,eventValidation, updateEvent);
router.post("/delete-event/:id", isLoggedIn, deleteEvent);
router.get("/events", getAllEvents);
router.get("/filter-events", getEventsByCategoryAndLocation);
router.get("/user-events", isLoggedIn, getUserEvents);
router.get("/get-event/:id", isLoggedIn, getEventById);
router.get("/get-categories",  getUniqueCategories);

export default router;