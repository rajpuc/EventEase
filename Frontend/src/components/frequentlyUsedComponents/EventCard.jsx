// src/components/frequentlyUsedComponents/EventCard.jsx
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const EventCard = ({ event }) => {
  const eventDate = dayjs.tz(event.date, "Asia/Dhaka").format("MMM D, YYYY");
  const eventTime = dayjs.tz(
    `${dayjs(event.date).format("YYYY-MM-DD")}T${
      event.time.length === 5 ? event.time + ":00" : event.time
    }`,
    "Asia/Dhaka"
  ).format("hh:mm A");

  return (
    <div className="card bg-base-200 shadow-xl">
      <figure>
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-xl font-bold">{event.title}</h2>
        <p className="text-sm text-gray-500">
          {eventDate} at {eventTime}
        </p>
        <div className="card-actions justify-end mt-4">
          <Link
            to={`/events/${event._id}`}
            className="btn btn-primary btn-sm rounded-full"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
