import { useState, useEffect } from "react";
import { autocompleteCity } from "../api";

export default function LocationInput({ city, setCity, location, setLocation, setError }) {
  const [suggestions, setSuggestions] = useState([]);

  // When user types, fetch suggestions
  useEffect(() => {
    const fetch = async () => {
      if (city.length < 2) {
        setSuggestions([]);
        return;
      }
      const results = await autocompleteCity(city);
      setSuggestions(results);
    };

    const timeout = setTimeout(fetch, 300); // debounce
    return () => clearTimeout(timeout);
  }, [city]);

  return (
    <div style={{ marginBottom: "20px", position: "relative" }}>
      <label>
        City (optional):{" "}
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Shimla, Delhi, Bangalore..."
          style={{ padding: "6px", width: "230px" }}
        />
      </label>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            background: "white",
            border: "1px solid #ccc",
            width: "230px",
            zIndex: 10,
            marginTop: "2px",
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((s, i) => (
            <div
              key={i}
              style={{
                padding: "6px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onClick={() => {
                setCity(s);
                setSuggestions([]);
              }}
            >
              {s}
            </div>
          ))}
        </div>
      )}

      {/* Existing GPS button */}
      <div>
        <button
          onClick={() => {
            if (!navigator.geolocation) {
              setError("Your browser does not support location.");
              return;
            }

            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setLocation({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                });
                setError("");
              },
              (err) => {
                const messages = {
                  1: "Permission denied. Please enable location access.",
                  2: "Position unavailable. Try stepping outside or enabling GPS.",
                  3: "Timeout. GPS signal too weak.",
                };
                setError(messages[err.code] || "Failed to get location.");
              },
              {
                enableHighAccuracy: true,  // ⭐ forces GPS
                timeout: 8000,
                maximumAge: 0,
              }
            );
          }}
          style={{ marginTop: "10px", padding: "6px 12px" }}
        >
          Use My Current Location
        </button>

        {location && (
          <span style={{ marginLeft: "12px" }}>
            📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </span>
        )}
      </div>
    </div>
  );
}
