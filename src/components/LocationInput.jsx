export default function LocationInput({ city, setCity, location, setLocation, setError }) {
    const handleUseMyLocation = () => {
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
          setError("Failed to get location: " + err.message);
        }
      );
    };

    return (
      <div style={{ marginBottom: "20px" }}>
        <label>
          City (optional):{" "}
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Shimla, Delhi, Bangalore..."
            style={{ padding: "6px", width: "230px" }}
          />
        </label>

        <div>
          <button onClick={handleUseMyLocation} style={{ marginTop: "10px", padding: "6px 12px" }}>
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
