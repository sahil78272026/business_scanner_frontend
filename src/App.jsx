import { useState } from "react";
import { geocodeCity, fetchBusinesses, exportCSV } from "./api";

import LocationInput from "./components/LocationInput";
import SearchFilters from "./components/SearchFilters";
import BusinessTable from "./components/BusinessTable";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState(null);
  const [businessType, setBusinessType] = useState("lodging");
  const [radius, setRadius] = useState(2000);
  const [keyword, setKeyword] = useState("");

  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError("");

      let loc = location;

      // If city provided, convert city → lat,lng
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
      });

      setBusinesses(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const exportFile = () => {
    if (!location) {
      setError("Search first to set a location.");
      return;
    }

    exportCSV({
      lat: location.lat,
      lng: location.lng,
      type: businessType,
      radius,
      keyword,
    });
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
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

      <button onClick={performSearch} disabled={loading} style={{ padding: "8px 16px", marginRight: "10px" }}>
        {loading ? "Searching..." : "Search"}
      </button>

      <button onClick={exportFile} style={{ padding: "8px 16px" }}>
        Export CSV
      </button>

      <ErrorMessage message={error} />

      <BusinessTable businesses={businesses} />
    </div>
  );
}

export default App;
