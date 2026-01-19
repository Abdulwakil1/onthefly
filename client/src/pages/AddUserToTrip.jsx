import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Snackbar, Alert, CircularProgress } from "@mui/material";
import "./CreateActivity.css";
import { API_URL } from "../config";

const AddUserToTrip = () => {
  const { trip_id } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // -------------------------
  // Helpers
  // -------------------------
  const normalizeUsername = (value) => value.trim().toLowerCase();

  const isValidUsername = (value) => /^[a-z0-9-]+$/.test(value);

  // -------------------------
  // Load travelers
  // -------------------------
  useEffect(() => {
    const fetchTravelers = async () => {
      try {
        const res = await fetch(`/api/users-trips/users/${trip_id}`);
        if (!res.ok) throw new Error("Failed to load travelers");
        const data = await res.json();
        setTravelers(data);
      } catch (err) {
        setToast({
          open: true,
          message: err.message,
          severity: "error",
        });
      }
    };

    fetchTravelers();
  }, [trip_id]);
  // console.log("Travelers:", travelers);

  // -------------------------
  // Submit handler
  // -------------------------
  const addUserToTrip = async (e) => {
    e.preventDefault();

    const normalized = normalizeUsername(username);

    // 1️⃣ Empty check
    if (!normalized) {
      return setToast({
        open: true,
        message: "Username is required",
        severity: "error",
      });
    }

    // 2️⃣ Format validation (mirror backend)
    if (!isValidUsername(normalized)) {
      return setToast({
        open: true,
        message: "Username may contain only letters, numbers, or hyphens",
        severity: "error",
      });
    }

    // 3️⃣ UX duplicate check (DB still enforces truth)
    if (travelers.some((t) => t.username?.toLowerCase() === normalized)) {
      return setToast({
        open: true,
        message: "This user is already added",
        severity: "warning",
      });
    }

    try {
      setLoading(true);

      // const res = await fetch(`/api/users-trips/create/${trip_id}`, {
      const res = await fetch(`${API_URL}/users-trips/create/${trip_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: normalized }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add user");
      }

      // Backend verified to return gaurenteed username instead of user Id
      setTravelers((prev) => [
        ...prev,
        {
          id: data.user_id,
          username: data.username,
        },
      ]);

      setUsername("");

      setToast({
        open: true,
        // message: `${data?.username ?? "Traveler"} added successfully`,
        message: data.username
          ? `${data.username} added to trip successfully`
          : "Traveler added to trip successfully",
        severity: "success",
      });

      setTimeout(() => {
        navigate(`/trip/get/${trip_id}`);
      }, 1500);
    } catch (err) {
      setToast({
        open: true,
        message: err.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createActivity">
      <h2>Add Traveler to Trip</h2>

      <form onSubmit={addUserToTrip} noValidate>
        <label>GitHub Username</label>
        <input
          type="text"
          value={username}
          disabled={loading}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Trip ID</label>
        <input type="number" value={trip_id} readOnly />

        <input
          type="submit"
          value={loading ? "Adding..." : "Add Traveler"}
          disabled={loading}
        />
      </form>

      {loading && <CircularProgress size={22} />}

      <div className="travelers">
        <h3>Travelers</h3>
        {travelers.length === 0 ? (
          <p>No travelers yet.</p>
        ) : (
          // travelers.map((t) => <p key={t.username}>{t.username}</p>)
          travelers.map((t, index) => (
            <p key={t.username ?? `traveler-${index}`}>
              {t.username ?? "Unknown user"}
            </p>
          ))
        )}
      </div>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddUserToTrip;
