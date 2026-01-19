// src/pages/CreateDestination.jsx
import { useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { Snackbar, Alert, CircularProgress } from "@mui/material";
import "./CreateDestination.css";
import { API_URL } from "../config";

const CreateDestination = ({ refreshDestinations }) => {
  const navigate = useNavigate();
  const { trip_id } = useParams();

  const [destination, setDestination] = useState({
    destination: "",
    description: "",
    city: "",
    country: "",
    img_url: "",
    flag_img_url: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // -------------------------------
  // Validation
  // -------------------------------
  const fieldMaxLengths = {
    destination: 100,
    city: 100,
    country: 100,
    description: 2000,
  };

  const validateField = (name, value) => {
    let msg = "";

    // Required checks
    if (["destination", "city", "country"].includes(name) && !value?.trim()) {
      msg = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    // Max length
    if (
      value &&
      fieldMaxLengths[name] &&
      value.length > fieldMaxLengths[name]
    ) {
      msg = `${name.charAt(0).toUpperCase() + name.slice(1)} cannot exceed ${
        fieldMaxLengths[name]
      } characters`;
    }

    // URL checks
    if (
      (name === "img_url" || name === "flag_img_url") &&
      value?.trim() &&
      !/^https?:\/\//i.test(value)
    ) {
      msg = `${
        name === "img_url" ? "Image" : "Flag"
      } URL must be a valid http(s) link`;
    }

    return msg;
  };

  // -------------------------------
  // Input handler (live validation)
  // -------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;

    let errorMsg = validateField(name, value);

    // Show max length message when user hits the limit
    if (
      (name === "destination" || name === "city" || name === "country") &&
      value.length === 100
    ) {
      errorMsg = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } cannot exceed 100 characters`;
    }
    if (name === "description" && value.length === 2000) {
      errorMsg = "Description cannot exceed 2000 characters";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    setDestination((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -------------------------------
  // API helpers
  // -------------------------------
  const addDestination = async () => {
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(destination),
      };

      // const res = await fetch("/api/destinations", options);
      const res = await fetch(`${API_URL}/api/destinations`, options);
      if (!res.ok) throw new Error(`Add destination failed (${res.status})`);
      const data = await res.json();

      // success toast
      setToast({
        open: true,
        message: "Destination created.",
        severity: "success",
      });

      // return new destination id
      return data.id;
    } catch (err) {
      console.error("addDestination error:", err);
      setToast({
        open: true,
        message: "Failed to add destination.",
        severity: "error",
      });
      return null;
    }
  };

  const createTripDestination = async (destination_id) => {
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_id: parseInt(trip_id, 10),
          destination_id: destination_id,
        }),
      };

      // endpoint name: must match backend /api/trips_destinations
      // const res = await fetch("/api/trips_destinations", options);
      const res = await fetch(`${API_URL}/api/trips_destinations`, options);
      if (!res.ok)
        throw new Error(`Associate destination failed (${res.status})`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("createTripDestination error:", err);
      setToast({
        open: true,
        message: "Failed to associate destination with trip.",
        severity: "error",
      });
      return null;
    }
  };

  // -------------------------------
  // Form submit
  // -------------------------------
  const createDestination = async (event) => {
    event.preventDefault();

    // global validation
    const newErrors = {};
    Object.keys(destination).forEach((key) => {
      const msg = validateField(key, destination[key]);
      if (msg) newErrors[key] = msg;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setToast({
        open: true,
        message: "Please fix the validation errors.",
        severity: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      // 1️⃣ Add new destination
      const destId = await addDestination();
      if (!destId) return;

      // 2️⃣ Associate with trip
      const assoc = await createTripDestination(destId);
      if (!assoc) return;

      // 3️⃣ Dynamic reload: refresh destinations in parent
      if (refreshDestinations) await refreshDestinations();

      // 4️⃣ Navigate after delay so user sees toast
      setTimeout(() => navigate(`/trip/get/${trip_id}`), 800);
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------
  // JSX
  // -------------------------------
  return (
    <div>
      <center>
        <h3>Add Destination</h3>
      </center>

      <form onSubmit={createDestination}>
        {/* Destination */}
        <label>Destination</label>
        <input
          type="text"
          name="destination"
          value={destination.destination}
          onChange={handleChange}
          maxLength={100}
        />
        {errors.destination && (
          <p className="error-text">{errors.destination}</p>
        )}
        <br />

        {/* Description */}
        <label>Description</label>
        <textarea
          rows="5"
          cols="50"
          name="description"
          value={destination.description}
          onChange={handleChange}
          maxLength={2000}
        ></textarea>
        <p style={{ fontSize: "14px", textAlign: "right", color: "#c62828" }}>
          {destination.description.length}/2000
        </p>
        {errors.description && (
          <p className="error-text">{errors.description}</p>
        )}
        <br />

        {/* City */}
        <label>City</label>
        <input
          type="text"
          name="city"
          value={destination.city}
          onChange={handleChange}
          maxLength={100}
        />
        {errors.city && <p className="error-text">{errors.city}</p>}
        <br />

        {/* Country */}
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={destination.country}
          onChange={handleChange}
          maxLength={100}
        />
        {errors.country && <p className="error-text">{errors.country}</p>}
        <br />

        {/* Image URL */}
        <label>Image URL</label>
        <input
          type="text"
          name="img_url"
          value={destination.img_url}
          onChange={handleChange}
        />
        {errors.img_url && <p className="error-text">{errors.img_url}</p>}
        <br />

        {/* Flag Image URL */}
        <label>Flag Image URL</label>
        <input
          type="text"
          name="flag_img_url"
          value={destination.flag_img_url}
          onChange={handleChange}
        />
        {errors.flag_img_url && (
          <p className="error-text">{errors.flag_img_url}</p>
        )}
        <br />

        {/* Trip ID (read-only) */}
        <label>Trip ID</label>
        <input type="text" value={trip_id} readOnly />
        <br />

        {/* Submit button */}
        <button className="submit-btn" type="submit" disabled={submitting}>
          {submitting ? <CircularProgress size={26} /> : "Submit"}
        </button>
      </form>

      {/* Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setToast((s) => ({ ...s, open: false }))}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateDestination;
