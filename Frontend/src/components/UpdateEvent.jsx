import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import "dayjs/locale/bn";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { updateFormData } from "../lib/helperfunction";
import useEventStore from "../store/useEventStore";

dayjs.extend(utc);
dayjs.extend(timezone);

const UpdateEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get event ID from URL params
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    image: null,
    category: "",
  });

  const { isUpdatingEvent, getEventById, updateEvent } = useEventStore(); // Assuming Zustand store
  const [error, setError] = useState("");
  const [isChanging, setIsChanging] = useState(false);

  // Fetch the event details on component mount
  useEffect(() => {
    const fetchEventDetails = async () => {
      const response = await getEventById(id);
      if (response.status === "success") {
        const event = response.data;
        console.log(response,event)
        setFormData({
          title: event.title,
          description: event.description,
          location: event.location,
          date: dayjs(event.date).format("YYYY-MM-DD"),
          time: dayjs(event.time).tz("Asia/Dhaka", true).format("HH:mm"),
          image: event.image,
          category: event.category,
        });
      } else {
        toast.error(response.message || "Event not found");
        navigate("/events");
      }
    };

    fetchEventDetails();
  }, [id, getEventById, navigate]);

  const handleChange = async (e) => {
    setIsChanging(true);
    const { name, value, files } = e.target;
    if (name === "image") {
      const data = await updateFormData(files[0]);
      setFormData((prev) => ({ ...prev, image: data }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setIsChanging(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { date, time, title, description, location, image, category } = formData;

    if (!title || !description || !location || !date || !time || !image || !category) {
      return setError("All fields are required.");
    }

    const eventDateTime = dayjs.tz(`${date} ${time}`, "Asia/Dhaka");

    if (dayjs().tz("Asia/Dhaka").isAfter(dayjs(eventDateTime))) {
      return setError("Date and time must be in the future.");
    }

    const data = {
      title,
      description,
      location,
      image,
      date: eventDateTime.format("YYYY-MM-DD"),
      time: eventDateTime.format("HH:mm"),
      category,
    };

    const response = await updateEvent(id, data);
    if (response.status === "success") {
      toast.success(response.message);
      navigate(`/events/${response.data._id}`);
    } else {
      toast.error(response.message || "Failed to update event");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 rounded-xl shadow-md mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Update Event</h2>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          className="input input-bordered w-full"
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Event Description"
          className="textarea textarea-bordered w-full"
          rows="4"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Event Location"
          className="input input-bordered w-full"
          value={formData.location}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            className="input input-bordered w-full"
            value={formData.date}
            onChange={handleChange}
          />

          <input
            type="time"
            name="time"
            className="input input-bordered w-full"
            value={formData.time}
            onChange={handleChange}
          />
        </div>

        <input
          type="text"
          name="category"
          placeholder="Event Category"
          className="input input-bordered w-full"
          value={formData.category}
          onChange={handleChange}
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          onChange={handleChange}
        />

        <button className="btn btn-neutral w-full">
          Update Event
          {isChanging || isUpdatingEvent ? (
            <span className="loading loading-infinity text-white w-7"></span>
          ) : null}
        </button>
      </form>
    </div>
  );
};

export default UpdateEvent;
