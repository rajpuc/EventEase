import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";
import dayjs from "dayjs";
import "dayjs/locale/bn";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { updateFormData } from "../lib/helperfunction";
import useEventStore from "../store/useEventStore";

dayjs.extend(utc);
dayjs.extend(timezone);

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    image: null,
    category:""
  });
  
  const {isCreatingEvent,createEvent} = useEventStore();
  const [error, setError] = useState("");
  const [isChanging,setIsChanging]= useState(false);

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
    

    const { date, time, title, description, location, image, category} = formData;

    if (!title || !description || !location || !date || !time || !image || !category) {
      return setError("All fields are required.");
    }

    const eventDateTime = dayjs.tz(`${date} ${time}`, "Asia/Dhaka");

    if (dayjs().tz("Asia/Dhaka").isAfter(dayjs(eventDateTime))) {
      return setError("Date and time must be in the future.");
    }

    
    const data = {
      "title": title,
      "description": description,
      "location": location,
      "image": image,
      "date": eventDateTime.format("YYYY-MM-DD"),
      "time": eventDateTime.format("HH:mm"),
      "category":category
    }

    const response=await createEvent(data);  
    if(response.status === "success"){
      toast.success(response.message);
      console.log(response);
      navigate("/events/"+response.data._id)
    }else{
      toast.error(response.message,response.error)
    }
  
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 rounded-xl shadow-md mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Create Event</h2>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Event Title"
          className="input input-bordered w-full"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Event Description"
          className="textarea textarea-bordered w-full"
          rows="4"
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Event Location"
          className="input input-bordered w-full"
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            className="input input-bordered w-full"
            onChange={handleChange}
          />

          <input
            type="time"
            name="time"
            className="input input-bordered w-full"
            onChange={handleChange}
          />
        </div>

        <input
          type="text"
          name="category"
          placeholder="Event Category"
          className="input input-bordered w-full"
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
            Submit Event
            {isChanging && <span className="loading loading-infinity text-white w-7"></span>}
            {isCreatingEvent && <span className="loading loading-infinity text-white w-7"></span>}

        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
