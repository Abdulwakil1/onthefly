import { useState, useEffect } from "react";
import AddTripOptionCard from "../components/AddTripOptionCard";
import { Snackbar, Alert } from "@mui/material";

const AddToTrip = ({ data }) => {
  const [trips, setTrips] = useState([]);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    setTrips(data);
  }, [data]);

  return (
    <div className="AddToTrip">
      {trips && trips.length > 0 ? (
        trips.map((trip) => (
          <AddTripOptionCard
            key={trip.id}
            id={trip.id}
            title={trip.title}
            description={trip.description}
            img_url={trip.img_url}
            setToast={setToast} // <-- pass it here
          />
        ))
      ) : (
        <h3 className="noResults">No Trips Yet 😞</h3>
      )}

      {/* TOAST */}
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

export default AddToTrip;
