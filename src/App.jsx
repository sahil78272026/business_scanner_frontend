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
    window.location.reload(); // reload homepage
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      setError("");

      let loc = location;

      // Convert city → coordinates
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
    if (!nextToken) return;

    const data = await fetchBusinesses({
      lat: location.lat,
      lng: location.lng,
      type: businessType,
      radius,
      keyword,
      next_page_token: nextToken
    });

    // append results to existing list
    setBusinesses(prev => [...prev, ...data.businesses]);

    // update token
    setNextToken(data.next_page_token || null);
  };

  const exportFile = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!businesses.length) {
      alert("Please search and load businesses before exporting.");
      return;
    }

    // ⭐ MERGE EMAILS INTO BUSINESSES ⭐
    const merged = businesses.map((b, index) => ({
      ...b,
      emails: window.emailMapGlobal[index] || []   // added below
    }));

    // ⭐ Send loaded businesses to backend
    exportCSVFromFrontend(merged);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>

      {/* ⭐ Login / Logout UI */}
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

      <button onClick={exportFile} style={{ padding: "8px 16px" }}>
        Export CSV
      </button>

      <ErrorMessage message={error} />

      <BusinessTable businesses={businesses}
      />

      {nextToken && (
        <button onClick={loadMore} style={{ marginTop: "15px", padding: "8px 16px" }}>
          Load More
        </button>
      )}
    </div>
  );
}

export default App;
