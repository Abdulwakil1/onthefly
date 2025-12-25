import { useState } from "react";
import "./ActivityBtn.css";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

// Animation for snackbar
function SlideUp(props) {
  return <Slide {...props} direction="up" />;
}

const ActivityBtn = ({ id, activity, num_votes: initialVotes }) => {
  const [numVotes, setNumVotes] = useState(initialVotes);
  const [isUpdating, setIsUpdating] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const showSnackbar = (type, message) => {
    setSnackbar({ open: true, type, message });
  };

  const updateCount = async () => {
    if (isUpdating) return; // Prevent rapid double-votes
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ num_votes: numVotes + 1 }),
      });

      if (!response.ok) {
        showSnackbar("error", "Vote failed — try again.");
        return;
      }

      // Update state + animation
      setNumVotes((prev) => prev + 1);

      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    } catch (error) {
      console.error("Vote update error:", error);
      showSnackbar("error", "Could not connect to server.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <button
        className="activityBtn"
        id={id}
        onClick={updateCount}
        disabled={isUpdating}
      >
        {activity}
        <br />
        <span className={animate ? "vote animated" : "vote"}>
          {"△ " + numVotes + " Upvotes"}
        </span>
      </button>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={SlideUp}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ActivityBtn;
