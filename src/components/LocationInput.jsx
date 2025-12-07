import { useState, useEffect } from "react";
import { autocompleteCity } from "../api";

export default function LocationInput({ city, setCity, location, setLocation, setError }) {
  const [suggestions, setSuggestions] = useState([]);
  const [ignoreFetch, setIgnoreFetch] = useState(false);  // ⭐ prevents unwanted fetch

  useEffect(() => {
    if (ignoreFetch) return;           // ⭐ Do NOT fetch after selection

    const fetchSuggestions = async () => {
      if (!city || city.length < 2) {
        setSuggestions([]);
        return;
      }

      const results = await autocompleteCity(city);
      setSuggestions(results || []);
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [city, ignoreFetch]);  // ⭐ include ignoreFetch to stop refiring

  const handleSelect = (value) => {
    setIgnoreFetch(true);       // ⭐ stop fetching when selecting!
    setCity(value);
    setSuggestions([]);         // Hide dropdown
  };

  const clearCity = () => {
    setCity("");
    setSuggestions([]);
    setLocation(null);
    setIgnoreFetch(false);      // ⭐ re-enable fetch after clearing
  };

  return (
    <div style={{ marginBottom: "20px", position: "relative" }}>
      <label style={{ position: "relative", display: "inline-block" }}>
        City (optional):{" "}
        <div style={{ position: "relative", display: "inline-block" }}>
          <input
            value={city}
            onChange={(e) => {
              setCity(e.target.value);

              // ⭐ When user types again → enable autocomplete
              setIgnoreFetch(false);

              if (!e.target.value) {
                setSuggestions([]);
                setLocation(null);
              }
            }}
            placeholder="Shimla, Delhi, Bangalore..."
            style={{ padding: "6px 30px 6px 6px", width: "230px" }}
          />

          {/* ❌ Clear Button */}
          {city && (
            <button
              onClick={clearCity}
              style={{
                position: "absolute",
                right: "5px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "16px",
                color: "#777",
              }}
              title="Clear"
            >
              ✕
            </button>
          )}
        </div>
      </label>

      {/* 🔽 Suggestions */}
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
              onMouseDown={() => handleSelect(s)}  // ⭐ use onMouseDown (prevents blur issues)
            >
              {s}
            </div>
          ))}
        </div>
      )}

      {/* 📍 GPS untouched */}
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
                setCity("");       // Clear text if GPS chosen
                setSuggestions([]);
                setIgnoreFetch(false);
              },
              (err) => {
                const messages = {
                  1: "Permission denied. Please enable location access.",
                  2: "Position unavailable. Try stepping outside or enabling GPS.",
                  3: "Timeout. GPS signal too weak.",
                };
                setError(messages[err.code] || "Failed to get location.");
              },
              { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
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
