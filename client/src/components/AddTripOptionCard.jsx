import { useParams, useNavigate } from "react-router";
import "./Card.css";
const AddTripOptionCard = (props) => {
  const { id, setToast } = props;
  const navigate = useNavigate();
  const { destination_id } = useParams();

  const addToTrip = async () => {
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_id: id,
          destination_id: Number(destination_id),
        }),
      };

      const response = await fetch("/api/trips_destinations", options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add destination");
      }

      // Success
      setToast({
        open: true,
        message: "Destination added!",
        severity: "success",
      });
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error("AddToTrip error:", err.message);

      setToast({
        open: true,
        message: err.message, // show specific backend message
        severity: "error",
      });
    }
  };

  return (
    <div className="Card" style={{ backgroundImage: `url(${props.img_url})` }}>
      <div className="card-info">
        <h2 className="title">{props.title}</h2>
        <p className="description">{props.description}</p>
        <button className="addToTrip" onClick={addToTrip}>
          + Add to Trip
        </button>
      </div>
    </div>
  );
};

export default AddTripOptionCard;
