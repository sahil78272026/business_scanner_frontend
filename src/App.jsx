import { useState } from "react";
import { exportCSVFromFrontend, geocodeCity, fetchBusinesses, exportCSV } from "./api";

import LocationInput from "./components/LocationInput";
import SearchFilters from "./components/SearchFilters";
import BusinessTable from "./components/BusinessTable";
import ErrorMessage from "./components/ErrorMessage";
import Navbar from "./components/Navbar";

function App() {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState(null);
  const [businessType, setBusinessType] = useState("lodging");
  const [radius, setRadius] = useState(2000);
  const [keyword, setKeyword] = useState("");

  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextToken, setNextToken] = useState(null);

  // ⭐ Check login status
  const isLoggedIn = !!localStorage.getItem("token");

  // ⭐ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      setError("");

      let loc = location;

      if (!loc && city.trim()) {
        const geo = await geocodeCity(city.trim());
        setLocation(geo);
        loc = geo;
      }

      if (!loc) {
        setError("Please provide a city or use your current location.");
        return;
      }

      const data = await fetchBusinesses({
        lat: loc.lat,
        lng: loc.lng,
        type: businessType,
        radius,
        keyword,
        next_page_token: null
      });

      setBusinesses(data.businesses);
      setNextToken(data.next_page_token || null);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    setLoading(true);
    if (!nextToken) return;

    const data = await fetchBusinesses({
      lat: location.lat,
      lng: location.lng,
      type: businessType,
      radius,
      keyword,
      next_page_token: nextToken
    });

    setBusinesses(prev => [...prev, ...data.businesses]);
    setNextToken(data.next_page_token || null);
    setLoading(false);
  };

  const exportFile = () => {
    const token = localStorage.getItem("token");

    if (!businesses.length) {
      alert("Please search and load businesses before exporting.");
      return;
    }

    if (!token) {
      alert("You are not logged in, Login to use this feature");
      window.location.href = "/login";
      return;
    }

    const merged = businesses.map((b, index) => ({
      ...b,
      emails: window.emailMapGlobal[index] || []
    }));

    exportCSVFromFrontend(merged);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>

      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <h1>Local Business Scanner</h1>

      <LocationInput
        city={city}
        setCity={setCity}
        location={location}
        setLocation={setLocation}
        setError={setError}
      />

      <SearchFilters
        businessType={businessType}
        setBusinessType={setBusinessType}
        radius={radius}
        setRadius={setRadius}
        keyword={keyword}
        setKeyword={setKeyword}
      />

      <button
        onClick={performSearch}
        disabled={loading}
        style={{ padding: "8px 16px", marginRight: "10px" }}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {/* ⭐ Export Button Always Visible but Disabled if Not Logged In */}
      <button
        onClick={exportFile}
        disabled={!isLoggedIn}
        title={isLoggedIn ? "Download CSV" : "Login to export data"}
        style={{
          padding: "8px 16px",
          opacity: isLoggedIn ? 1 : 0.6,
          cursor: isLoggedIn ? "pointer" : "not-allowed",
        }}
      >
        Export CSV
      </button>

      <ErrorMessage message={error} />

      <BusinessTable businesses={businesses} />

      {nextToken && (
        <button
          onClick={loadMore}
          disabled={loading}
          style={{
            marginTop: "15px",
            padding: "8px 16px",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}

export default App;
