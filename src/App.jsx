import { useState, useEffect } from "react";
import { exportCSVFromFrontend, geocodeCity, fetchBusinesses } from "./api";

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
  const [exporting, setExporting] = useState(false);

  // ⭐ Credits
  const [credits, setCredits] = useState(null);

  // ⭐ Check login
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // ⭐ Fetch credits
  useEffect(() => {
    async function loadCredits() {
      if (!isLoggedIn) return setCredits(null);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/credits`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const data = await res.json();
        if (res.ok && typeof data.credits === "number") {
          setCredits(data.credits);
        }
      } catch (err) {
        console.error("Failed to load credits", err);
      }
    }
    loadCredits();
  }, [isLoggedIn]);

  // ⭐ Search
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
        next_page_token: null,
      });

      setBusinesses(data.businesses);
      setNextToken(data.next_page_token || null);

      if (typeof data.credits === "number") setCredits(data.credits);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Load More
  const loadMore = async () => {
    if (!nextToken || !location) return;

    try {
      setLoading(true);

      const data = await fetchBusinesses({
        lat: location.lat,
        lng: location.lng,
        type: businessType,
        radius,
        keyword,
        next_page_token: nextToken,
      });

      setBusinesses((prev) => [...prev, ...data.businesses]);
      setNextToken(data.next_page_token || null);

      if (typeof data.credits === "number") setCredits(data.credits);
    } catch (err) {
      console.error("Load more failed", err);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Export CSV
  const exportFile = async () => {
    if (!isLoggedIn) {
      alert("You are not logged in. Please login to export.");
      window.location.href = "/login";
      return;
    }

    if (!businesses.length) {
      alert("Please search and load businesses before exporting.");
      return;
    }

    if (credits !== null && credits <= 0) {
      alert("You have no credits left.");
      return;
    }

    // ⭐ SHOW LOADING STATE
    setExporting(true);

    const token = localStorage.getItem("token");

    const merged = businesses.map((b, index) => ({
      ...b,
      emails:
        (window.emailMapGlobal && window.emailMapGlobal[index]) ||
        b.emails ||
        [],
    }));

    try {
      await exportCSVFromFrontend(merged);

      // Refresh credits after export
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/credits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && typeof data.credits === "number") {
        setCredits(data.credits);
      }
    } catch (err) {
      console.error("Export failed", err);
      alert("Export failed. Please try again.");
    } finally {
      // ⭐ STOP LOADING STATE
      setExporting(false);
    }
  };


  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} credits={credits} />

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

      <ErrorMessage message={error} />

      <BusinessTable
        businesses={businesses}
        isLoggedIn={isLoggedIn}
      />

      {businesses.length > 0 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={exportFile}
            disabled={
              exporting ||
              !isLoggedIn ||
              (credits !== null && credits <= 0)
            }
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              opacity:
                exporting ||
                  !isLoggedIn ||
                  (credits !== null && credits <= 0)
                  ? 0.6
                  : 1,
              cursor:
                exporting ||
                  !isLoggedIn ||
                  (credits !== null && credits <= 0)
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      )}


      {nextToken && (
        <button
          onClick={loadMore}
          disabled={loading}
          style={{
            marginTop: "15px",
            padding: "8px 16px",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}

export default App;
