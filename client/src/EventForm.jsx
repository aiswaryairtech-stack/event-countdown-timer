import React, { useState } from "react";
import api from "./api";

export default function EventForm({ onEventCreated }) {
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !targetDate) {
      return;
    }

    try {
      const response = await api.post("/api/events/", {
        title: title,
        target_date: new Date(targetDate).toISOString(),
      });

      onEventCreated(response.data);

      setTitle("");
      setTargetDate("");

      setMessage("Event added successfully! 🎉");

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (err) {
      console.error("Failed to create event", err);
      console.error("Server response:", err.response?.data);

      setMessage("Could not create event. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-10"
    >

      {/* Form heading */}
      <div className="flex items-center gap-3 mb-6">

        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
          ➕
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Create New Countdown
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Add an upcoming event you want to keep track of.
          </p>
        </div>

      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_250px_auto] gap-4">

        {/* Event title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Event name
          </label>

          <input
            type="text"
            placeholder="e.g. My Birthday"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date & time
          </label>

          <input
            type="datetime-local"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        {/* Button */}
        <div className="flex items-end">

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            Add Event
          </button>

        </div>

      </div>

      {/* Message */}
      {message && (
        <div
          className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium ${
            message.includes("successfully")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

    </form>
  );
}