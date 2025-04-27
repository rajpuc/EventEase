import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import useEventStore from "../store/useEventStore";
import Loader from "./frequentlyUsedComponents/Loader";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend Day.js with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const EventListings = () => {
  const { events, getAllEvents, isLoadingEvents, pagination } = useEventStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllEvents(page).catch(() => toast.error("Failed to load events"));
  }, [page, getAllEvents]);

  const handleLoadMore = () => {
    if (pagination?.hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="px-6 py-10 bg-base-100 min-h-screen mt-3">
      <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>

      {isLoadingEvents && !events.length ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => {
            const eventDate = dayjs.tz(event.date, "Asia/Dhaka").format("MMM D, YYYY");
            const eventTime = dayjs.tz(`${dayjs(event.date).format("YYYY-MM-DD")}T${event.time.length === 5 ? event.time + ":00" : event.time}`, "Asia/Dhaka").format("hh:mm A");

            return (
              <div key={event._id} className="card bg-base-200 shadow-xl">
                <figure>
                  <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-t-xl" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-xl font-bold">{event.title}</h2>
                  <p className="text-sm text-gray-500">{eventDate} at {eventTime}</p>
                  <div className="card-actions justify-end mt-4">
                    <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm rounded-full">View Details</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pagination?.hasMore && (
        <div className="flex justify-center mt-10">
          <button onClick={handleLoadMore} className="btn btn-outline btn-primary rounded-full">Load More</button>
        </div>
      )}
    </div>
  );
};

export default EventListings;
