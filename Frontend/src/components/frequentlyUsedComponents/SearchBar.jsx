import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useEventStore from "../../store/useEventStore";

const SearchBar = () => {
  const { categories ,getAllCategories} = useEventStore();
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const navigate = useNavigate();
    useEffect(() => {
      getAllCategories();
    }, []);

  const handleSearch = () => {
    if (!category && !location) {
      toast.error("Please select a category or enter a location");
      return;
    }

    // If only category provided
    if (category && !location) {
      navigate(`/search/${category}`);
    }
    // If only location provided
    else if (!category && location) {
      navigate(`/search-location/${location}`);
    }
    // If both provided
    else {
      navigate(`/search/${category}/${location}`);
    }

    document.getElementById("my_modal_2").close(); // close the modal after search
  };

  return (
    <dialog id="my_modal_2" className="modal modal-top w-screen">
      <div className="modal-box flex items-center justify-center ">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Location */}
          <label className="input input-bordered flex items-center gap-2">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              className="grow"
              placeholder="Search by location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>

          {/* Category */}
          <select
            className="select select-bordered"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a Category</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button onClick={handleSearch} className="btn btn-neutral">
            Search
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default SearchBar;
