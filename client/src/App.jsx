import "./App.css";
import { useState, useEffect } from "react";
import { Link, useRoutes } from "react-router";
import ReadTrips from "./pages/ReadTrips";
import CreateTrip from "./pages/CreateTrip";
import EditTrip from "./pages/EditTrip";
import CreateDestination from "./pages/CreateDestination";
import ReadDestinations from "./pages/ReadDestinations";
import TripDetails from "./pages/TripDetails";
import CreateActivity from "./pages/CreateActivity";
import AddToTrip from "./pages/AddToTrip";
import AddUserToTrip from "./pages/AddUserToTrip";
import { useNavigate } from "react-router";

import Login from "./pages/Login";
import Avatar from "./components/Avatar";
import { API_URL } from "./config";

const App = () => {
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  // const API_URL = "http://localhost:3001";
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      const response = await fetch(`${API_URL}/trips`);
      if (!response.ok) throw new Error("Failed to fetch trips");
      const data = await response.json();
      setTrips(data);
    } catch (err) {
      console.error("Error fetching trips:", err);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${API_URL}/destinations`);
      if (!response.ok) throw new Error("Failed to fetch destinations");
      const data = await response.json();
      setDestinations(data);
    } catch (err) {
      console.error("Error fetching destinations:", err);
    }
  };
  const getUser = async () => {
    try {
      const response = await fetch(`/auth/login/success`, {
        // const response = await fetch(`${AUTH_URL}/login/success`, {
        // const response = await fetch(`${API_URL}/auth/login/success`, {
        credentials: "include",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const json = await response.json();
      setUser(json.user || null);
    } catch (err) {
      console.error("Error loading user:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchDestinations();
    getUser();
  }, []);

  // ---- LOGOUT FUNCTION ---- //
  const logout = async () => {
    try {
      const url = `/auth/logout`;
      // const url = `${API_URL}/auth/logout`;
      const response = await fetch(url, { credentials: "include" });
      const json = await response.json();

      // Clear user on frontend
      setUser(null);

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // ---- ROUTE PROTECTION UTILITY ---- //
  const auth = (component) =>
    user && user.id ? component : <Login setUser={setUser} />;

  // ---- ROUTES ---- //
  const routes = [
    {
      path: "/",
      element: auth(<ReadTrips user={user} data={trips} />),
    },
    {
      path: "/trip/new",
      element: auth(
        <CreateTrip user={user} api_url={API_URL} refreshTrips={fetchTrips} />
      ),
    },
    {
      path: "/edit/:id",
      element: auth(
        <EditTrip
          user={user}
          data={trips}
          api_url={API_URL}
          refreshTrips={fetchTrips}
        />
      ),
    },
    {
      path: "/destinations",
      element: auth(<ReadDestinations user={user} data={destinations} />),
    },
    {
      path: "/destination/new/:trip_id",
      element: auth(
        <CreateDestination
          user={user}
          api_url={API_URL}
          refreshDestinations={fetchDestinations}
        />
      ),
    },
    {
      path: "/trip/get/:id",
      element: auth(<TripDetails user={user} data={trips} api_url={API_URL} />),
    },
    {
      path: "/activity/create/:trip_id",
      element: auth(<CreateActivity user={user} api_url={API_URL} />),
    },
    {
      path: "/destinations/add/:destination_id",
      element: auth(<AddToTrip user={user} data={trips} api_url={API_URL} />),
    },
    {
      path: "/users/add/:trip_id",
      element: auth(<AddUserToTrip api_url={API_URL} />),
    },
  ];

  const element = useRoutes(routes);

  return (
    <div className="App">
      {/* ---- HEADER ONLY IF AUTHENTICATED ---- */}
      {user && user.id ? (
        <div className="header">
          <h1>On The Fly ✈️</h1>

          <Link to="/">
            <button className="headerBtn">Explore Trips</button>
          </Link>

          <Link to="/destinations">
            <button className="headerBtn">Explore Destinations</button>
          </Link>

          <Link to="/trip/new">
            <button className="headerBtn"> + Add Trip </button>
          </Link>
          {/* --- LOGOUT BUTTON --- */}
          <button onClick={logout} className="headerBtn">
            Logout
          </button>
          <Avatar className="avatar" user={user} />
        </div>
      ) : null}

      {element}
    </div>
  );
};

export default App;
