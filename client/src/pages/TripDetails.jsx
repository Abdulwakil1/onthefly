// TripDetails.jsx
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import ActivityBtn from "../components/ActivityBtn";
import DestinationBtn from "../components/DestinationBtn";
import { Snackbar, Alert } from "@mui/material";
import "./TripDetails.css";

const TripDetails = ({ data, api_url }) => {
  const { id } = useParams();

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

  const [activities, setActivities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [travelers, setTravelers] = useState([]);

  // Toast for fetch errors + vote success/failure
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    // Load trip details
    const result = data.find((item) => item.id === parseInt(id));
    if (result) {
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
    }

    // Fetch activities
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${api_url}/api/activities/${id}`);
        if (!response.ok) throw new Error("Failed to fetch activities");

        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error loading activities:", error);
        setToast({
          open: true,
          message: "Could not load activities.",
          severity: "error",
        });
      }
    };

    // Fetch destinations
    const fetchDestinations = async () => {
      try {
        const response = await fetch(
          `${api_url}/api/trips_destinations/destinations/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch destinations");

        const data = await response.json();
        setDestinations(data);
      } catch (error) {
        console.error("Error loading destinations:", error);
        setToast({
          open: true,
          message: "Could not load destinations.",
          severity: "error",
        });
      }
    };

    fetchActivities();
    fetchDestinations();
  }, [data, id, api_url]);

  useEffect(() => {
    const fetchTravelers = async () => {
      try {
        const res = await fetch(`${api_url}/api/users-trips/users/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch travelers");
        }

        const json = await res.json();
        setTravelers(json);
      } catch (err) {
        console.error("Error loading travelers:", err);
      }
    };

    fetchTravelers();
  }, [api_url, id]);

  return (
    <div className="out">
      <div className="flex-container">
        <div className="left-side">
          <h3>{post.title}</h3>
          <p>{"🗓️ Duration: " + post.num_days + " days "}</p>
          <p>{"🛫 Depart: " + post.start_date}</p>
          <p>{"🛬 Return: " + post.end_date}</p>
          <p>{post.description}</p>
        </div>

        <div
          className="right-side"
          style={{ backgroundImage: `url(${post.img_url})` }}
        ></div>
      </div>

      <div className="flex-container">
        <div className="travelers">
          {travelers && travelers.length > 0
            ? travelers.map((traveler, index) => (
                <p
                  key={traveler.id || index}
                  style={{
                    textAlign: "center",
                    lineHeight: 0,
                    paddingTop: 20,
                  }}
                >
                  {traveler.username}
                </p>
              ))
            : ""}

          <br />

          <Link to={`/users/add/${id}`}>
            <button className="addActivityBtn">+ Add Traveler</button>
          </Link>
        </div>

        <div className="activities">
          {activities.map((activity) => (
            <ActivityBtn
              key={activity.id}
              id={activity.id}
              activity={activity.activity}
              num_votes={activity.num_votes}
              //   setToast={setToast} // ← PASS TO CHILD FOR VOTING FEEDBACK
            />
          ))}

          <br />
          <Link to={`../../activity/create/${id}`}>
            <button className="addActivityBtn">+ Add Activity</button>
          </Link>
        </div>

        <div className="destinations">
          {destinations.map((destination) => (
            <DestinationBtn
              key={destination.id}
              id={destination.id}
              destination={destination.destination}
            />
          ))}

          <br />
          <Link to={`../../destination/new/${id}`}>
            <button className="addDestinationBtn">+ Add Destination</button>
          </Link>
        </div>
      </div>

      {/* GLOBAL TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
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

export default TripDetails;

// //last working version
// import { useState, useEffect } from "react";
// import { Link, useParams } from "react-router";
// import ActivityBtn from "../components/ActivityBtn";
// import DestinationBtn from "../components/DestinationBtn";
// import "./TripDetails.css";

// const TripDetails = ({ data }) => {
//   const { id } = useParams();

//   const [post, setPost] = useState({
//     id: 0,
//     title: "",
//     description: "",
//     img_url: "",
//     num_days: 0,
//     start_date: "",
//     end_date: "",
//     total_cost: 0.0,
//   });

//   const [activities, setActivities] = useState([]);
//   const [destinations, setDestinations] = useState([]);

//   useEffect(() => {
//     // Set the trip information
//     const result = data.find((item) => item.id === parseInt(id));
//     if (result) {
//       setPost({
//         id: parseInt(result.id),
//         title: result.title,
//         description: result.description,
//         img_url: result.img_url,
//         num_days: parseInt(result.num_days),
//         start_date: result.start_date.slice(0, 10),
//         end_date: result.end_date.slice(0, 10),
//         total_cost: result.total_cost,
//       });
//     }

//     // Fetch activities
//     const fetchActivities = async () => {
//       try {
//         const response = await fetch(`/api/activities/${id}`);
//         if (!response.ok) throw new Error("Failed to fetch activities");

//         const data = await response.json();
//         setActivities(data);
//       } catch (error) {
//         console.error("Error loading activities:", error);
//       }
//     };

//     // Fetch destinations
//     const fetchDestinations = async () => {
//       try {
//         // FIX: correct route name -> trips_destinations
//         const response = await fetch(
//           `/api/trips_destinations/destinations/${id}`
//         );
//         if (!response.ok) throw new Error("Failed to fetch destinations");

//         const data = await response.json();
//         setDestinations(data);
//       } catch (error) {
//         console.error("Error loading destinations:", error);
//       }
//     };

//     fetchActivities();
//     fetchDestinations();
//   }, [data, id]);

//   return (
//     <div className="out">
//       <div className="flex-container">
//         <div className="left-side">
//           <h3>{post.title}</h3>
//           <p>{"🗓️ Duration: " + post.num_days + " days "}</p>
//           <p>{"🛫 Depart: " + post.start_date}</p>
//           <p>{"🛬 Return: " + post.end_date}</p>
//           <p>{post.description}</p>
//         </div>

//         <div
//           className="right-side"
//           style={{ backgroundImage: `url(${post.img_url})` }}
//         ></div>
//       </div>

//       <div className="flex-container">
//         <div className="activities">
//           {activities.map((activity) => (
//             <ActivityBtn
//               key={activity.id}
//               id={activity.id}
//               activity={activity.activity}
//               num_votes={activity.num_votes}
//             />
//           ))}
//           <br />
//           <Link to={`../../activity/create/${id}`}>
//             <button className="addActivityBtn">+ Add Activity</button>
//           </Link>
//         </div>

//         <div className="destinations">
//           {destinations.map((destination) => (
//             <DestinationBtn
//               key={destination.id}
//               id={destination.id}
//               destination={destination.destination}
//             />
//           ))}
//           <br />
//           <Link to={`../../destination/new/${id}`}>
//             <button className="addDestinationBtn">+ Add Destination</button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TripDetails;
// import { useState, useEffect } from "react";
// import { Link, useParams } from "react-router";
// import ActivityBtn from "../components/ActivityBtn";
// import DestinationBtn from "../components/DestinationBtn";
// import { Snackbar, Alert } from "@mui/material"; // ✅ Added MUI imports
// import "./TripDetails.css";

// const TripDetails = ({ data }) => {
//   const { id } = useParams();

//   const [post, setPost] = useState({
//     id: 0,
//     title: "",
//     description: "",
//     img_url: "",
//     num_days: 0,
//     start_date: "",
//     end_date: "",
//     total_cost: 0.0,
//   });

//   const [activities, setActivities] = useState([]);
//   const [destinations, setDestinations] = useState([]);

//   // ✅ Toast state for handling vote errors/success
//   const [toast, setToast] = useState({
//     open: false,
//     message: "",
//     severity: "error",
//   });

//   useEffect(() => {
//     // Set trip details
//     const result = data.find((item) => item.id === parseInt(id));
//     if (result) {
//       setPost({
//         id: parseInt(result.id),
//         title: result.title,
//         description: result.description,
//         img_url: result.img_url,
//         num_days: parseInt(result.num_days),
//         start_date: result.start_date.slice(0, 10),
//         end_date: result.end_date.slice(0, 10),
//         total_cost: result.total_cost,
//       });
//     }

//     // Fetch activities
//     const fetchActivities = async () => {
//       try {
//         const response = await fetch(`/api/activities/${id}`);
//         if (!response.ok) throw new Error("Failed to fetch activities");

//         const data = await response.json();
//         setActivities(data);
//       } catch (error) {
//         console.error("Error loading activities:", error);
//       }
//     };

//     // Fetch destinations
//     const fetchDestinations = async () => {
//       try {
//         const response = await fetch(
//           `/api/trips_destinations/destinations/${id}`
//         );
//         if (!response.ok) throw new Error("Failed to fetch destinations");

//         const data = await response.json();
//         setDestinations(data);
//       } catch (error) {
//         console.error("Error loading destinations:", error);
//       }
//     };

//     fetchActivities();
//     fetchDestinations();
//   }, [data, id]);

//   return (
//     <div className="out">
//       <div className="flex-container">
//         <div className="left-side">
//           <h3>{post.title}</h3>
//           <p>{"🗓️ Duration: " + post.num_days + " days "}</p>
//           <p>{"🛫 Depart: " + post.start_date}</p>
//           <p>{"🛬 Return: " + post.end_date}</p>
//           <p>{post.description}</p>
//         </div>

//         <div
//           className="right-side"
//           style={{ backgroundImage: `url(${post.img_url})` }}
//         ></div>
//       </div>

//       <div className="flex-container">
//         <div className="activities">
//           {activities.map((activity) => (
//             <ActivityBtn
//               key={activity.id}
//               id={activity.id}
//               activity={activity.activity}
//               num_votes={activity.num_votes}
//               setToast={setToast} // ✅ Pass toast function down
//             />
//           ))}

//           <br />

//           <Link to={`../../activity/create/${id}`}>
//             <button className="addActivityBtn">+ Add Activity</button>
//           </Link>
//         </div>

//         <div className="destinations">
//           {destinations.map((destination) => (
//             <DestinationBtn
//               key={destination.id}
//               id={destination.id}
//               destination={destination.destination}
//             />
//           ))}

//           <br />

//           <Link to={`../../destination/new/${id}`}>
//             <button className="addDestinationBtn">+ Add Destination</button>
//           </Link>
//         </div>
//       </div>

//       {/* ✅ Global Toast (only used by ActivityBtn voting errors) */}
//       <Snackbar
//         open={toast.open}
//         autoHideDuration={1800}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//         onClose={() => setToast((prev) => ({ ...prev, open: false }))}
//       >
//         <Alert severity={toast.severity} variant="filled">
//           {toast.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default TripDetails;

// import { useState, useEffect } from "react";
// import { Link, useParams } from "react-router";
// import ActivityBtn from "../components/ActivityBtn";
// import DestinationBtn from "../components/DestinationBtn";
// import "./TripDetails.css";

// const TripDetails = ({ data }) => {
//   const { id } = useParams();
//   const [post, setPost] = useState({
//     id: 0,
//     title: "",
//     description: "",
//     img_url: "",
//     num_days: 0,
//     start_date: "",
//     end_date: "",
//     total_cost: 0.0,
//   });
//   const [activities, setActivities] = useState([]);
//   const [destinations, setDestinations] = useState([]);

//   useEffect(() => {
//     const result = data.filter((item) => item.id === parseInt(id))[0];
//     setPost({
//       id: parseInt(result.id),
//       title: result.title,
//       description: result.description,
//       img_url: result.img_url,
//       num_days: parseInt(result.num_days),
//       start_date: result.start_date.slice(0, 10),
//       end_date: result.end_date.slice(0, 10),
//       total_cost: result.total_cost,
//     });

//     const fetchActivities = async () => {
//       const response = await fetch("/api/activities/" + id);
//       const data = await response.json();
//       setActivities(data);
//     };

//     const fetchDestinations = async () => {
//       const response = await fetch(
//         "/api/trips-destinations/destinations/" + id
//       );
//       const data = await response.json();
//       setDestinations(data);
//     };

//     fetchActivities();
//     fetchDestinations();
//   }, [data, id]);

//   return (
//     <div className="out">
//       <div className="flex-container">
//         <div className="left-side">
//           <h3>{post.title}</h3>
//           <p>{"🗓️ Duration: " + post.num_days + " days "}</p>
//           <p>{"🛫 Depart: " + post.start_date}</p>
//           <p>{"🛬 Return: " + post.end_date}</p>
//           <p>{post.description}</p>
//         </div>

//         <div
//           className="right-side"
//           style={{ backgroundImage: `url(${post.img_url})` }}
//         ></div>
//       </div>

//       <div className="flex-container">
//         <div className="activities">
//           {activities && activities.length > 0
//             ? activities.map((activity, index) => (
//                 <ActivityBtn
//                   id={activity.id}
//                   activity={activity.activity}
//                   num_votes={activity.num_votes}
//                 />
//               ))
//             : ""}
//           <br />
//           <Link to={"../../activity/create/" + id}>
//             <button className="addActivityBtn">+ Add Activity</button>
//           </Link>
//         </div>
//         <div className="destinations">
//           {destinations && destinations.length > 0
//             ? destinations.map((destination, index) => (
//                 <DestinationBtn
//                   id={destination.id}
//                   destination={destination.destination}
//                 />
//               ))
//             : ""}
//           <br />
//           <Link to={"../../destination/new/" + id}>
//             <button className="addDestinationBtn">+ Add Destination</button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TripDetails;
