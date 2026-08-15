import React, { useState, useEffect } from "react";

export default function CountdownCard({ event, onDelete, onEdit }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference =
      new Date(event.target_date).getTime() - new Date().getTime();

    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [event.target_date]);

  const formattedDate = new Date(event.target_date).toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* Top Section */}
      <div className="p-6">

        <div className="flex justify-between items-start gap-3">

          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-xl shrink-0">
              🎯
            </div>

            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {event.title}
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                📅 {formattedDate}
              </p>
            </div>
          </div>

        </div>

        {/* Countdown */}
        <div className="mt-6">

          {timeLeft ? (
            <div className="grid grid-cols-4 gap-2">

              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <span className="block text-2xl font-black text-blue-600">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">
                  Days
                </span>
              </div>

              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <span className="block text-2xl font-black text-purple-600">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-purple-500">
                  Hours
                </span>
              </div>

              <div className="bg-indigo-50 rounded-xl p-3 text-center">
                <span className="block text-2xl font-black text-indigo-600">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-indigo-500">
                  Mins
                </span>
              </div>

              <div className="bg-pink-50 rounded-xl p-3 text-center">
                <span className="block text-2xl font-black text-pink-600">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-pink-500">
                  Secs
                </span>
              </div>

            </div>
          ) : (
            <div className="text-center py-5 bg-green-50 text-green-700 rounded-xl font-semibold">
              🎉 The event has arrived!
            </div>
          )}

        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 flex justify-end gap-3">

        <button
          onClick={() => onEdit(event)}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-100 transition"
        >
          ✏️ Edit
        </button>

        <button
          onClick={() => onDelete(event.id)}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-100 transition"
        >
          🗑️ Delete
        </button>

      </div>

    </div>
  );
}