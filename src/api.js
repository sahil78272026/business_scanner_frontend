const API_BASE = "http://localhost:5000"; // Change in production

export async function geocodeCity(city) {
  const res = await fetch(`${API_BASE}/api/geocode?city=${encodeURIComponent(city)}`);
  if (!res.ok) throw new Error("Unable to geocode city");
  return res.json();
}

export async function fetchBusinesses({ lat, lng, type, radius, keyword }) {
  const params = new URLSearchParams({
    lat,
    lng,
    type: type || "",
    radius: radius || 2000,
  });

  if (keyword?.trim()) {
    params.append("keyword", keyword.trim());
  }

  const res = await fetch(`${API_BASE}/api/businesses?${params.toString()}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "API Error");

  return data;
}

export function exportCSV({ lat, lng, type, radius, keyword }) {
  const params = new URLSearchParams({
    lat,
    lng,
    type: type || "",
    radius: radius || 2000,
  });

  if (keyword?.trim()) {
    params.append("keyword", keyword.trim());
  }

  window.location.href = `${API_BASE}/api/export-csv?${params.toString()}`;
}


export async function autocompleteCity(query) {
  const res = await fetch(`http://localhost:5000/api/autocomplete?query=${query}`);
  return res.json();
}

