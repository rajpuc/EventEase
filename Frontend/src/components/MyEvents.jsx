import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useEventStore from "../store/useEventStore";
import toast from "react-hot-toast";
import Loader from "./frequentlyUsedComponents/Loader";

const MyEvents = () => {
  const {
    userEvents,
    isLoadingUserEvents,
    getUserEvents,
    deleteEvent,
    isDeletingEvent
  } = useEventStore();
  const navigate = useNavigate();

  // Fetch the user events when the component mounts
  useEffect(() => {
    getUserEvents();
  }, [getUserEvents]);

  // Handle delete event
  const handleDeleteEvent = async (eventId) => {
    const result = await deleteEvent(eventId);
    if (result.status === "success") {
      toast.success("Event deleted successfully!");
    } else {
      toast.error("Failed to delete event");
    }
  };

  // Handle view event details
  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Handle edit event
  const handleEditEvent = (eventId) => {
    navigate(`/dashboard/edit/${eventId}`);
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <h2 className="text-3xl font-semibold mb-4">Your Created Events</h2>
      {isLoadingUserEvents ? (
        <Loader/>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userEvents.length > 0 ? (
            userEvents.map((event) => (
              <div
                key={event._id}
                className="card shadow-lg rounded-lg overflow-hidden bg-white"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between p-4 mt-auto">
                  <button
                    onClick={() => handleViewDetails(event._id)}
                    className="btn btn-primary"
                  >
                    Show Details
                  </button>
                  <button
                    onClick={() => handleEditEvent(event._id)}
                    className="btn btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="btn btn-danger"
                  >
                    {isDeletingEvent?<span className="loading loading-infinity text-white w-7"></span>:"Delete"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
