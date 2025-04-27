import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import useEventStore from "../store/useEventStore";
import Loader from "./frequentlyUsedComponents/Loader";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const EventDetails = () => {
  const { id } = useParams();
  const { getEventById, selectedEvent, isLoadingEvent } = useEventStore();

  useEffect(() => {
    if (id) {
      getEventById(id).catch(() => toast.error("Failed to fetch event details"));
    }
  }, [id, getEventById]);

  if (isLoadingEvent || !selectedEvent) {
    return <Loader />;
  }

  const { title, description, location, image, category, date, time, createdAt } = selectedEvent;

  // Extract date portion (e.g., 2025-04-28)
  const datePart = dayjs(date).format("YYYY-MM-DD");

  // Combine with time (add :00 seconds if missing)
  const fullDateTime = `${datePart}T${time.length === 5 ? time + ":00" : time}`;

  // Format for BD Timezone
  const eventDate = dayjs.tz(datePart, "Asia/Dhaka").format("MMMM D, YYYY");
  const eventTime = dayjs.tz(fullDateTime, "Asia/Dhaka").format("hh:mm A");
  const postedDate = dayjs.tz(createdAt, "Asia/Dhaka").format("MMMM D, YYYY, h:mm A");

  return (
    <div className="mx-auto mt-10 px-6 py-10 bg-base-100 max-w-[1400px] w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src={image} alt={title} className="rounded-2xl shadow-lg w-full object-cover" />
        <div>
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-sm text-gray-500 mb-2">
            Category: <span className="font-medium text-base-content">{category}</span>
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Location: <span className="font-medium text-base-content">{location}</span>
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Date & Time:{" "}
            <span className="font-medium text-base-content">{eventDate} at {eventTime}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Posted on:{" "}
            <span className="font-medium text-base-content">{postedDate}</span>
          </p>
          <div className="prose max-w-none text-base-content">
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
