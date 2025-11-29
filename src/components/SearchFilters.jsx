export default function SearchFilters({
    businessType,
    setBusinessType,
    radius,
    setRadius,
    keyword,
    setKeyword,
  }) {
    return (
      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Business Type:&nbsp;
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              style={{ padding: "6px" }}
            >
              <option value="">Any</option>
              <option value="lodging">Hotels / Lodging</option>
              <option value="restaurant">Restaurants</option>
              <option value="cafe">Cafes</option>
              <option value="gym">Gyms</option>
              <option value="tourist_attraction">Tourist Attractions</option>
              <option value="store">Stores / Shops</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Radius (meters):{" "}
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              min={100}
              max={50000}
              style={{ padding: "6px", width: "120px" }}
            />
          </label>
        </div>

        <div>
          <label>
            Keyword (optional):{" "}
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="hotel, bakery, taxi, gym..."
              style={{ padding: "6px", width: "220px" }}
            />
          </label>
        </div>
      </div>
    );
  }
