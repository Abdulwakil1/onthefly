import { useState, useEffect } from "react";
import { useParams } from "react-router";
import "./EditTrip.css";
import { Snackbar, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";
import DeleteDialog from "../components/DeleteDialog";

const EditTrip = ({ data, refreshTrips, api_url }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // New states for DeleteDialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [post, setPost] = useState({
    id: 0,
    title: "",
    description: "",
    img_url: "",
    num_days: 0,
    start_date: "",
    end_date: "",
    total_cost: 0.0,
  });

  useEffect(() => {
    const result = data.filter((item) => item.id === parseInt(id))[0];
    if (!result) return;
    setPost({
      id: parseInt(result.id),
      title: result.title,
      description: result.description,
      img_url: result.img_url,
      num_days: parseInt(result.num_days),
      start_date: result.start_date.slice(0, 10),
      end_date: result.end_date.slice(0, 10),
      total_cost: result.total_cost,
    });
  }, [data, id]);

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
  const validateField = (name, value) => {
    let msg = "";

    if (name === "title") {
      if (value.length > 100) msg = "Title cannot exceed 100 characters";
      if (value.trim() === "") msg = "Title is required";
    }

    if (name === "description") {
      if (value.length > 2000)
        msg = "Description cannot exceed 2000 characters";
    }

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

    if (name === "start_date") {
      if (!value) msg = "Start date is required";
      const today = new Date().toISOString().split("T")[0];
      if (value < today) msg = "Start date cannot be in the past";
    }

    if (name === "end_date") {
      if (!value) msg = "End date is required";
      const today = new Date().toISOString().split("T")[0];
      if (value < today) msg = "End date cannot be in the past";
      if (value && post.start_date && value < post.start_date)
        msg = "End date cannot be before start date";
    }

    return msg;
  };

  // -------------------------------
  // Update Trip
  // -------------------------------
  const updateTrip = async (event) => {
    event.preventDefault();

    const newErrors = {};
    Object.keys(post).forEach((key) => {
      const err = validateField(key, post[key]);
      if (err) newErrors[key] = err;
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
      const res = await fetch(`${api_url}/trips/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });

      if (!res.ok) throw new Error("Failed to update trip");

      if (refreshTrips) await refreshTrips();

      setToast({
        open: true,
        message: "Trip successfully updated!",
        severity: "success",
      });

      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setToast({
        open: true,
        message: "Something went wrong updating the trip.",
        severity: "error",
      });
    }

    setSubmitting(false);
  };

  // -------------------------------
  // Handle input change
  // -------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -------------------------------
  // Delete Trip (opens dialog)
  // -------------------------------
  const deletePost = (event) => {
    event.preventDefault();
    setShowDeleteDialog(true);
  };

  // -------------------------------
  // Confirm deletion
  // -------------------------------
  const confirmDelete = async () => {
    setSubmitting(true);
    setDeleteError("");

    try {
      const res = await fetch(`${api_url}/trips/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete trip");

      if (refreshTrips) await refreshTrips();

      setToast({
        open: true,
        message: "Trip deleted successfully!",
        severity: "success",
      });

      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error(err);
      setDeleteError("Something went wrong while deleting.");
    } finally {
      setSubmitting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div>
      <center>
        <h3>Edit Trip</h3>
      </center>

      <form onSubmit={updateTrip}>
        {/* --- form fields unchanged --- */}
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
          {post.description.length}/2000
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

        <div className="button-group">
          <button className="submit-btn" type="submit" disabled={submitting}>
            {submitting ? <CircularProgress size={26} /> : "Update Trip"}
          </button>
          <button type="button" className="deleteButton" onClick={deletePost}>
            Delete
          </button>
        </div>
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

      {/* DELETE DIALOG */}
      {showDeleteDialog && (
        <DeleteDialog
          onCancel={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          error={deleteError}
        />
      )}
    </div>
  );
};

export default EditTrip;
