import { useState } from "react";
import "./CreateTrip.css";
import { Snackbar, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";

const CreateTrip = ({ refreshTrips, api_url, user }) => {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    id: 0,
    title: "",
    description: "",
    img_url: "",
    num_days: 0,
    start_date: "",
    end_date: "",
    total_cost: 0,
    username: user.username,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // -------------------------------
  // Validation Rules
  // -------------------------------
  const fieldMaxLengths = {
    title: 100,
    description: 2000,
    img_url: 500,
  };

  const validateField = (name, value) => {
    let msg = "";

    // Required
    if (name === "title" && !value?.trim()) {
      msg = "Title is required";
    }

    if (name === "start_date" && !value) {
      msg = "Start date is required";
    }

    if (name === "end_date" && !value) {
      msg = "End date is required";
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

    // Number validations
    if (name === "num_days") {
      const num = Number(value);
      if (num <= 0) msg = "Number of days must be greater than 0";
      if (num > 365) msg = "Trip cannot exceed 365 days";
    }

    if (name === "total_cost") {
      const cost = Number(value);
      if (cost < 0 || cost > 100000)
        msg = "Cost must be between $0 and $100,000";
    }

    // Date validations
    const today = new Date().toISOString().split("T")[0];
    if (name === "start_date" && value && value < today) {
      msg = "Start date cannot be in the past";
    }
    if (name === "end_date") {
      if (value && value < today) msg = "End date cannot be in the past";
      if (value && post.start_date && value < post.start_date) {
        msg = "End date cannot be before start date";
      }
    }
    // URL validation (live)
    if (name === "img_url" && value?.trim() && !/^https?:\/\//i.test(value)) {
      msg = "Image URL must be a valid http(s) link";
    }

    return msg;
  };

  // -------------------------------
  // Handle Input Changes + Live Validation
  // -------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;

    let errorMsg = validateField(name, value);

    // Max length specific feedback
    if (name === "title" && value.length === 100) {
      errorMsg = "Title cannot exceed 100 characters";
    }
    if (name === "description" && value.length === 2000) {
      errorMsg = "Description cannot exceed 2000 characters";
    }
    if (name === "img_url" && value.length === 500) {
      errorMsg = "Image URL cannot exceed 500 characters";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    setPost((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------------
  // Handle Submit
  // -------------------------------
  const createPost = async (event) => {
    event.preventDefault();

    // Final validation before sending
    const newErrors = {};
    Object.keys(post).forEach((key) => {
      const error = validateField(key, post[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
        body: JSON.stringify(post),
      };

      const res = await fetch(`${api_url}/trips`, options);

      if (!res.ok) throw new Error("Failed to create trip");

      setToast({
        open: true,
        message: "Trip successfully created!",
        severity: "success",
      });

      if (refreshTrips) await refreshTrips();

      // Redirect after short delay
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setToast({
        open: true,
        message: "Something went wrong creating the trip.",
        severity: "error",
      });
    }

    setSubmitting(false);
  };

  return (
    <div>
      <center>
        <h3>Create New Trip</h3>
      </center>

      <form onSubmit={createPost}>
        {/* TITLE */}
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={post.title}
          maxLength={100}
          onChange={handleChange}
        />
        {errors.title && <p className="error-text">{errors.title}</p>}
        <br />

        {/* DESCRIPTION */}
        <label>Description</label>
        <textarea
          rows="5"
          cols="50"
          name="description"
          value={post.description}
          maxLength={2000}
          onChange={handleChange}
        ></textarea>
        <p style={{ fontSize: "14px", textAlign: "right", color: "#c62828" }}>
          {post.description.length}/{2000}
        </p>
        {errors.description && (
          <p className="error-text">{errors.description}</p>
        )}
        <br />

        {/* IMAGE URL */}
        <label>Image URL</label>
        <input
          type="text"
          name="img_url"
          value={post.img_url}
          onChange={handleChange}
        />
        {errors.img_url && <p className="error-text">{errors.img_url}</p>}

        <br />

        {/* DAYS */}
        <label>Number of Days</label>
        <input
          type="number"
          name="num_days"
          value={post.num_days}
          onChange={handleChange}
        />
        {errors.num_days && <p className="error-text">{errors.num_days}</p>}
        <br />

        {/* START DATE */}
        <label>Start Date</label>
        <input
          type="date"
          name="start_date"
          value={post.start_date}
          onChange={handleChange}
        />
        {errors.start_date && <p className="error-text">{errors.start_date}</p>}
        <br />

        {/* END DATE */}
        <label>End Date</label>
        <input
          type="date"
          name="end_date"
          value={post.end_date}
          onChange={handleChange}
        />
        {errors.end_date && <p className="error-text">{errors.end_date}</p>}
        <br />

        {/* COST */}
        <label>Total Cost</label>
        <input
          type="number"
          name="total_cost"
          value={post.total_cost}
          onChange={handleChange}
        />
        {errors.total_cost && <p className="error-text">{errors.total_cost}</p>}
        <br />

        {/* SUBMIT BUTTON */}
        <button className="submit-btn" type="submit" disabled={submitting}>
          {submitting ? <CircularProgress size={26} /> : "Submit"}
        </button>
      </form>

      {/* TOASTS */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateTrip;
