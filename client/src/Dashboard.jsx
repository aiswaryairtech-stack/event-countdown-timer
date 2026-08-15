import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "./api";
import EventForm from "./EventForm";
import CountdownCard from "./CountdownCard";
import "./App.css";


export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingEvent, setEditingEvent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/api/events/");
      setEvents(response.data);
    } catch (err) {
      console.error("Could not fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreated = (newEvent) => {
    setEvents((prev) =>
      [...prev, newEvent].sort(
        (a, b) =>
          new Date(a.target_date) - new Date(b.target_date)
      )
    );
  };

  const handleEventDelete = async (id) => {
    try {
      await api.delete(`/api/events/${id}/`);

      setEvents((prev) =>
        prev.filter((event) => event.id !== id)
      );
    } catch (err) {
      console.error("Could not delete event", err);
      alert("Could not delete the event.");
    }
  };

  // Open edit modal
  const handleEventEdit = (event) => {
    setEditingEvent(event);
    setEditTitle(event.title);

    const date = new Date(event.target_date);

    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    setEditDate(localDate);
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingEvent(null);
    setEditTitle("");
    setEditDate("");
  };

  // Save edited event
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!editTitle.trim() || !editDate) {
      return;
    }

    setSavingEdit(true);

    try {
      const response = await api.put(
        `/api/events/${editingEvent.id}/`,
        {
          title: editTitle.trim(),
          target_date: new Date(editDate).toISOString(),
        }
      );

      setEvents((prev) =>
        prev
          .map((event) =>
            event.id === editingEvent.id
              ? response.data
              : event
          )
          .sort(
            (a, b) =>
              new Date(a.target_date) -
              new Date(b.target_date)
          )
      );

      closeEditModal();
    } catch (err) {
      console.error("Could not edit event", err);
      alert("Could not update the event.");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
              ⏳
            </div>

            <div>
              <h1 className="font-bold text-gray-900">
                Countdown
              </h1>

              <p className="text-xs text-gray-500">
                Your milestones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">

            <span className="hidden sm:block text-sm text-gray-600">
              Welcome,{" "}
              <span className="font-semibold text-gray-900">
                {user?.username}
              </span>
            </span>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10">

        {/* Hero Section */}
        <section className="mb-10">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            ✨ Stay organized
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Event Countdown
          </h2>

          <p className="mt-3 text-gray-600 text-lg max-w-2xl">
            Keep track of birthdays, trips, launches and all
            the moments you're looking forward to.
          </p>

        </section>

        {/* Create Event */}
        <section className="mb-10">
          <EventForm onEventCreated={handleEventCreated} />
        </section>

        {/* Events Heading */}
        {!loading && events.length > 0 && (
          <div className="flex items-center justify-between mb-5">
            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                Your Events
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {events.length}{" "}
                {events.length === 1 ? "event" : "events"} tracked
              </p>

            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">

            <div className="text-4xl mb-3">
              ⏳
            </div>

            <p className="text-gray-500">
              Loading your countdowns...
            </p>

          </div>

        ) : events.length === 0 ? (

          /* Empty State */
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm text-center py-16 px-6">

            <div className="text-6xl mb-5">
              🎯
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              No events yet
            </h3>

            <p className="text-gray-500 mt-2">
              Create your first countdown and start
              tracking something exciting.
            </p>

          </div>

        ) : (

          /* Event Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {events.map((event) => (
              <CountdownCard
                key={event.id}
                event={event}
                onDelete={handleEventDelete}
                onEdit={handleEventEdit}
              />
            ))}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-400">
        Event Countdown Timer • Built with Django & React
      </footer>

      {/* EDIT MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeEditModal}
          ></div>

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                  ✏️
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Edit Event
                  </h2>

                  <p className="text-sm text-gray-500">
                    Update your countdown
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
              >
                ✕
              </button>

            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEdit}>

              {/* Title */}
              <div className="mb-5">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event name
                </label>

                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />

              </div>

              {/* Date */}
              <div className="mb-6">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date & time
                </label>

                <input
                  type="datetime-local"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />

              </div>

              {/* Buttons */}
              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}