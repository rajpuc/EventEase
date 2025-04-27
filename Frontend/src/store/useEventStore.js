import { create } from "zustand";
import axiosInstance from "../lib/axios";

const useEventStore = create((set, get) => ({
  isCreatingEvent: false,
  createdEvent: null,
  createEvent: async (eventData) => {
    set({ isCreatingEvent: true });
    let result;

    try {
      let response;
      const image = await axiosInstance.post("/uploadfile", {
        file: eventData["image"],
      });
      if (image.data.status === "success") {
        const result = { ...eventData, image: image.data.data };
        response = await axiosInstance.post("/create-event", result);
      }

      result = {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      if (error.response?.data) {
        result = {
          status: error.response.data.status,
          message: error.response.data.message,
          error: error.response.data.error,
        };
      } else {
        result = {
          status: "failed",
          message: error.message,
        };
      }
    }

    set({ isCreatingEvent: false });
    return result;
  },

  isLoadingEvent: false,
  selectedEvent: null,

  getEventById: async (id) => {
    set({ isLoadingEvent: true });
    try {
      const response = await axiosInstance.get(`/get-event/${id}`);
      set({ selectedEvent: response.data.data, isLoadingEvent: false });
      return {
        status: "success",
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error fetching event:", error);
      set({ isLoadingEvent: false, event: null });
      return {
        status: "failed",
        message: error?.response?.data?.message || "Something went wrong",
      };
    }
  },

  // ===== GET ALL EVENTS =====
  events: [],
  isLoadingEvents: false,
  pagination: {
    total: 0,
    page: 1,
    totalPages: 0,
    hasMore: true,
  },

  getAllEvents: async (page = 1, limit = 6) => {
    set({ isLoadingEvents: true });

    try {
      const res = await axiosInstance.get(
        `/events?page=${page}&limit=${limit}`
      );
      const { data, pagination } = res.data;

      // If loading first page, replace; otherwise, append
      const currentEvents = get().events;
      const newEvents = page === 1 ? data : [...currentEvents, ...data];

      set({
        events: newEvents,
        pagination: {
          ...pagination,
          page,
          hasMore: page < pagination.totalPages,
        },
        isLoadingEvents: false,
      });
    } catch (error) {
      console.error("Error fetching events:", error.message);
      set({ isLoadingEvents: false });
    }
  },

  // ===== GET USER EVENTS =====
  userEvents: [],
  isLoadingUserEvents: false,

  getUserEvents: async (page = 1, limit = 6) => {
    set({ isLoadingUserEvents: true });

    try {
      const res = await axiosInstance.get(
        `/user-events?page=${page}&limit=${limit}`
      );
      const { data } = res.data;

      // If loading first page, replace; otherwise, append
      const currentUserEvents = get().userEvents;
      const newUserEvents = page === 1 ? data : [...currentUserEvents, ...data];

      set({
        userEvents: newUserEvents,
        isLoadingUserEvents: false,
      });
    } catch (error) {
      console.error("Error fetching user events:", error.message);
      set({ isLoadingUserEvents: false });
    }
  },

  // ===== DELETE EVENT =====
  isDeletingEvent: false,

  deleteEvent: async (eventId) => {
    set({ isDeletingEvent: true });

    try {
      const response = await axiosInstance.post(`/delete-event/${eventId}`);
      if (response.data.status === "success") {
        // Remove the deleted event from the store (if it exists in the list)
        const updatedEvents = get().events.filter(
          (event) => event._id !== eventId
        );
        const updatedUserEvents = get().userEvents.filter(
          (event) => event._id !== eventId
        );

        set({
          events: updatedEvents,
          userEvents: updatedUserEvents,
          isDeletingEvent: false,
        });

        return {
          status: "success",
          message: "Event deleted successfully",
        };
      }
    } catch (error) {
      console.error("Error deleting event:", error.message);
      set({ isDeletingEvent: false });
      return {
        status: "failed",
        message: error?.response?.data?.message || "Something went wrong",
      };
    }
  },

  // ===== UPDATE EVENT =====
  isUpdatingEvent: false,

  updateEvent: async (eventId, eventData) => {
    set({ isUpdatingEvent: true });

    let result;

    try {
      // Upload image if there's a new one
      let imageUrl = eventData.image;
      if (eventData.image && typeof eventData.image !== "string") {
        const imageResponse = await axiosInstance.post("/uploadfile", {
          file: eventData.image,
        });
        if (imageResponse.data.status === "success") {
          imageUrl = imageResponse.data.data;
        }
      }

      // Prepare the updated event data
      const updatedEventData = { ...eventData, image: imageUrl };

      // Send update request
      const response = await axiosInstance.post(
        `/update-event/${eventId}`,
        updatedEventData
      );

      // If the update is successful, return success result
      result = {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      };

      // Optionally, you can update the state here to reflect the updated event
      const updatedEvents = get().events.map((event) =>
        event._id === eventId ? response.data.data : event
      );
      const updatedUserEvents = get().userEvents.map((event) =>
        event._id === eventId ? response.data.data : event
      );

      set({
        events: updatedEvents,
        userEvents: updatedUserEvents,
        isUpdatingEvent: false,
      });
    } catch (error) {
      console.error("Error updating event:", error.message);
      result = {
        status: "failed",
        message: error?.response?.data?.message || "Something went wrong",
      };
      set({ isUpdatingEvent: false });
    }

    return result;
  },

  // ===== GET ALL CATEGORIES =====
  categories: [],
  isLoadingCategories: false,

  getAllCategories: async () => {
    set({ isLoadingCategories: true });

    try {
      const response = await axiosInstance.get("/get-categories");
      const categories = response.data.data;

      set({
        categories,
        isLoadingCategories: false,
      });

      return {
        status: "success",
        message: response.data.message,
        data: categories,
      };
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      set({ isLoadingCategories: false });
      return {
        status: "failed",
        message: error?.response?.data?.message || "Something went wrong",
      };
    }
  },

  // ===== SEARCH EVENTS BY CATEGORY AND LOCATION =====
  searchEventsByFilter: async (
    category = "",
    location = "",
    page = 1,
    limit = 6
  ) => {
    set({ isLoadingEvents: true });

    try {
      const query = new URLSearchParams({
        category,
        location,
        page,
        limit,
      }).toString();

      const res = await axiosInstance.get(`/filter-events?${query}`);
      const { data, pagination } = res.data;

      // If loading first page, replace; otherwise, append
      const currentEvents = get().events;
      const newEvents = page === 1 ? data : [...currentEvents, ...data];

      set({
        events: newEvents,
        pagination: {
          ...pagination,
          page,
          hasMore: page < pagination.totalPages,
        },
        isLoadingEvents: false,
      });
    } catch (error) {
      console.error("Error filtering events:", error.message);
      set({ isLoadingEvents: false });
    }
  },

  
}));

export default useEventStore;
