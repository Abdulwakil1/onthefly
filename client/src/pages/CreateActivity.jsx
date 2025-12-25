// src/pages/CreateActivity.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Snackbar, Alert, CircularProgress } from "@mui/material";
import "./CreateActivity.css";

const CreateActivity = () => {
  const navigate = useNavigate();
  const { trip_id } = useParams();

  const [activity, setActivity] = useState({ activity: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // -----------------------------------
  // Validation
  // -----------------------------------
  const validateField = (name, value) => {
    let msg = "";

    if (name === "activity" && !value.trim()) {
      msg = "Activity is required";
    }

    if (value.length > 150) {
      msg = "Activity cannot exceed 150 characters";
    }

    return msg;
  };

  // -----------------------------------
  // Handle Change (Live Validation)
  // -----------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;

    let errorMsg = validateField(name, value);

    // LIVE feedback when limit is hit
    if (name === "activity" && value.length === 150) {
      errorMsg = "Activity cannot exceed 150 characters";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    setActivity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------------
  // Submit
  // -----------------------------------
  const createActivity = async (event) => {
    event.preventDefault();

    // Validate before submit
    const newErrors = {};
    Object.keys(activity).forEach((key) => {
      const msg = validateField(key, activity[key]);
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
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity),
      };

      const res = await fetch(`/api/activities/${trip_id}`, options);
      if (!res.ok) throw new Error("Failed to create activity");

      setToast({
        open: true,
        message: "Activity created successfully!",
        severity: "success",
      });

      setTimeout(() => navigate(`/trip/get/${trip_id}`), 800);
    } catch (err) {
      console.error("createActivity error:", err);
      setToast({
        open: true,
        message: "Something went wrong creating the activity.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-activity-container">
      <center>
        <h3>Add Activity</h3>
      </center>

      <form onSubmit={createActivity}>
        <label>Activity</label>
        <br />
        <input
          type="text"
          name="activity"
          value={activity.activity}
          onChange={handleChange}
          maxLength={150}
        />
        {errors.activity && <p className="error-text">{errors.activity}</p>}
        <br />

        <label>Trip ID</label>
        <br />
        <input type="number" name="trip_id" value={trip_id} readOnly />
        <br />

        <input
          type="submit"
          value={submitting ? "" : "Submit"}
          disabled={submitting}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />

        {submitting && (
          <div
            style={{
              position: "relative",
              marginTop: "-60px", // keeps spinner inside the button
              marginBottom: "40px",
            }}
          >
            <CircularProgress size={24} style={{ color: "white" }} />
          </div>
        )}
      </form>

      {/* Snackbar Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={1800}
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

export default CreateActivity;
