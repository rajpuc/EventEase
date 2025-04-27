import React, { useEffect, useRef, useState } from 'react';
import useEventStore from '../store/useEventStore';
import { Link } from 'react-router-dom';


const EventCarousel = () => {
  const { events, getAllEvents, isLoadingEvents, pagination } = useEventStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  // Fetch events on component mount
  useEffect(() => {
    getAllEvents(1, 5);
  }, []);

  // Set up auto-sliding
  useEffect(() => {
    if (events.length > 1) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, 5000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [events, currentIndex]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
    resetInterval();
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
    resetInterval();
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      goToNext();
    }, 5000);
  };

  if (isLoadingEvents) {
    return (
      <div className="bg-black h-96 flex items-center justify-center">
        <div className="text-white text-xl"> <span className="loading loading-infinity text-white w-10"></span></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-black h-96 flex items-center justify-center">
        <div className="text-white text-xl">No events available</div>
      </div>
    );
  }

  const currentEvent = events[currentIndex];

  return (
    <div className="relative bg-black text-white overflow-hidden  mx-6 mt-6">
      {/* Carousel Content */}
      <div className="flex flex-col md:flex-row h-full">
        {/* Event Image */}
        <div className="w-full md:w-1/2 h-64 md:h-[400px]">
          <img
            src={currentEvent.image}
            alt={currentEvent.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Event Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 line-clamp-2">
            {currentEvent.title}
          </h2>

          <div className="flex items-center mb-6">
            <svg
              className="w-5 h-5 mr-2 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-gray-300">
              {new Date(currentEvent.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              at {currentEvent.time}
            </span>
          </div>

          <div className="flex items-center mb-6">
            <svg
              className="w-5 h-5 mr-2 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-gray-300">{currentEvent.location}</span>
          </div>

          <Link to={`/events/${currentEvent._id}`} className="self-start bg-white text-black px-6 py-2 rounded-md font-medium hover:bg-gray-200 transition duration-300">
            View Details
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300"
        aria-label="Previous event"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300"
        aria-label="Next event"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-gray-500'
            }`}
            aria-label={`Go to event ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default EventCarousel;