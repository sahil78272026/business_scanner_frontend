export const API_BASE = "http://localhost:5000"; // Change in production

export async function geocodeCity(city) {
  const res = await fetch(`${API_BASE}/api/geocode?city=${encodeURIComponent(city)}`);
  if (!res.ok) throw new Error("Unable to geocode city");
  return res.json();
}

export async function fetchBusinesses({ lat, lng, type, radius, keyword, next_page_token }) {
  const params = new URLSearchParams({
    lat,
    lng,
    type: type || "",
    radius: radius || 2000,
  });

  if (keyword?.trim()) {
    params.append("keyword", keyword.trim());
  }

  // ⭐ Add pagination token when loading next pages
  if (next_page_token) {
    params.append("next_page_token", next_page_token);
  }

  const res = await fetch(`${API_BASE}/api/businesses?${params.toString()}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "API Error");

  // ⭐ Data will be:
  // {
  //   businesses: [...],
  //   next_page_token: "...",
  // }

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


export async function exportCSVFromFrontend(businesses) {
  const res = await fetch("http://localhost:5000/api/export-csv", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ businesses })
  });

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "businesses.csv";
  a.click();

  window.URL.revokeObjectURL(url);
}


export async function autocompleteCity(query) {
  const res = await fetch(`http://localhost:5000/api/autocomplete?query=${query}`);
  return res.json();
}

export async function registerUser(email, password) {
  const res = await fetch("http://localhost:5000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return await res.json();
}

export async function loginUser(email, password) {
  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
  }

  return data;
}

export async function saveBusiness(business) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to save businesses");
    window.location.href = "/login";
    return;
  }

  const res = await fetch("http://localhost:5000/api/save-business", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(business),
  });

  const data = await res.json();

  if (data.message) alert(data.message);
}

export async function getSavedBusinesses() {
  const token = localStorage.getItem("token");
  if (!token) return [];

  const res = await fetch("http://localhost:5000/api/saved-businesses", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return await res.json();
}
