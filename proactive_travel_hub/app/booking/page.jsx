"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export default function Booking() {
  const { user, isLoaded } = useUser();
  const socketRef = useRef(null);

  const [mode, setMode] = useState("PERSONAL");

  const [userId, setUserId] = useState(null);
  const [corporateId, setCorporateId] = useState(null);
  const [company, setCompany] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [flightId, setFlightId] = useState("");
  const [price, setPrice] = useState("");

  const [showNotifications, setShowNotifications] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    initUserFlow();
  }, [isLoaded, user]);

  const initUserFlow = async () => {
    try {
      const res = await api.post("/users", {
        email: user.emailAddresses[0]?.emailAddress,
        username: user.fullName || "User",
      });

      const backendUser = res.data;
      setUserId(backendUser.id);

      await fetchCorporateDetails(backendUser.id);
      await fetchBookings(backendUser.id);

      connectWebSocket(backendUser.id);
    } catch (err) {
      handleError(err);
    }
  };

  const connectWebSocket = (uid) => {
    if (socketRef.current) return;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_BASE_URL.replace("http", "ws")}/ws/${uid}`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setNotifications((prev) => [data, ...prev]);
    };

    ws.onerror = () => {
      console.error("WebSocket error");
    };

    ws.onclose = () => {
      socketRef.current = null;
    };

    socketRef.current = ws;
  };

  const fetchCorporateDetails = async (uid) => {
    try {
      const mapRes = await api.get("/user-corporate");
      const mapping = mapRes.data.find((m) => m.user_id === uid);

      if (!mapping) return;

      setCorporateId(mapping.corporate_account_id);

      const companiesRes = await api.get("/corporate-accounts");
      const companyData = companiesRes.data.find(
        (c) => c.id === mapping.corporate_account_id
      );

      setCompany(companyData);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchBookings = async (uid) => {
    try {
      const res = await api.get(`/book/${uid}`);
      setBookings(res.data);
    } catch (err) {
      handleError(err);
    }
  };

const createBooking = async () => {
  try {
    if (mode === "WORK" && !corporateId) {
      setError("No corporate account assigned to this user.");
      return;
    }

    await api.post("/book", {
      user_id: userId,
      corporate_account_id:
        mode === "WORK" ? corporateId : null,
      flight_id: flightId,
      price: Number(price),
      trip_type: mode === "WORK" ? "WORK" : "LEISURE",
    });

    setFlightId("");
    setPrice("");
    fetchBookings(userId);
  } catch (err) {
    handleError(err);
  }
};

  const handleError = (err) => {
    setError(
      err?.response?.data?.detail ||
        err?.message ||
        "Something went wrong"
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-8 space-y-10 text-white mt-20 relative">

      {/* 🔔 Notification Bell */}
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative"
        >
          🔔
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 rounded-full">
              {notifications.length}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-black border rounded p-3 z-50">
            {notifications.map((n, i) => (
              <div key={i} className="border p-3 rounded mb-2">
                <p className="font-semibold">
                  ✈️ {n.flight_id}
                </p>
                <p className="text-sm text-gray-300">
                  Delayed by {n.delay_minutes} mins
                </p>
                <p className="text-blue-400 text-sm">
                  {n.suggestion}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Booking Dashboard</h1>
        <button
          onClick={() =>
            setMode(mode === "PERSONAL" ? "WORK" : "PERSONAL")
          }
          className={`px-5 py-2 rounded-full font-semibold
          ${mode === "WORK" ? "bg-blue-600" : "bg-gray-700"}`}
        >
          {mode}
        </button>
      </div>

      {/* Company Info */}
      {mode === "WORK" && company && (
        <div className="border rounded-lg p-5">
          <h2 className="font-semibold">Company Information</h2>
          <p>Company: {company.company_name}</p>
          <p className="text-blue-400">
            Policy Limit: ${company.policy_limit}
          </p>
        </div>
      )}

      {/* Booking Form */}
      <div className="border rounded-lg p-6">
        <h2 className="font-semibold mb-3">Book a Flight</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            value={flightId}
            onChange={(e) => setFlightId(e.target.value)}
            placeholder="Flight ID"
            className="border p-3 rounded bg-transparent"
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            type="number"
            className="border p-3 rounded bg-transparent"
          />
          <button
            onClick={createBooking}
            className="bg-blue-600 rounded font-semibold"
          >
            Book ({mode})
          </button>
        </div>
      </div>

      {/* Previous Bookings */}
      <div className="border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Previous Bookings</h2>

        {bookings.map((b) => (
          <div key={b.id} className="border p-4 rounded flex justify-between mb-2">
            <div>
              ✈️ {b.flight_id}
              <p className="text-sm text-gray-400">${b.price}</p>
              <span
                className={`text-xs px-2 py-1 rounded
                ${b.trip_type === "WORK" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                {b.trip_type}
              </span>
            </div>
            <span className="text-green-400">{b.status}</span>
          </div>
        ))}
      </div>

      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded w-96">
            <h2 className="font-bold mb-2">Error</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
