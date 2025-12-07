import "../styles/table.css";
import { saveBusiness } from "../api";
import { API_BASE } from "../api";
import { useState, useEffect } from "react";

export default function BusinessTable({ businesses }) {
  const [emailMap, setEmailMap] = useState({});
  const isLoggedIn = !!localStorage.getItem("token");


  // Fetch emails for each business asynchronously
  useEffect(() => {
    businesses.forEach((b, index) => {
      if (b.website) {
        fetch(`${API_BASE}/api/scrape-email?url=${encodeURIComponent(b.website)}`)
          .then(res => res.json())
          .then(data => {
            setEmailMap(prev => {
              const updated = { ...prev, [index]: data.emails };
              window.emailMapGlobal = updated;   // ⭐ STORE GLOBALLY
              return updated;
            });
          });
      } else {
        setEmailMap(prev => {
          const updated = { ...prev, [index]: [] };
          window.emailMapGlobal = updated;   // ⭐ ensure stored
          return updated;
        });
      }
    });
  }, [businesses]);


  if (!businesses.length) return null;

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Phone</th>
          <th>Rating</th>
          <th>Reviews</th>
          <th>Website</th>
          <th>Maps</th>
          <th>Email</th>
          {isLoggedIn && (
          <th>Save</th>
          )}

        </tr>
      </thead>

      <tbody>
        {businesses.map((b, i) => (
          <tr key={i}>
            <td>{b.name}</td>
            <td>{b.address}</td>
            <td>{b.phone}</td>
            <td>{b.rating}</td>
            <td>{b.reviews_count}</td>

            <td>
              {b.website ? (
                <a href={b.website} target="_blank" rel="noreferrer">
                  Visit
                </a>
              ) : (
                "-"
              )}
            </td>


            <td>
              {b.maps_url ? (
                <a href={b.maps_url} target="_blank" rel="noreferrer">
                  View
                </a>
              ) : (
                "-"
              )}
            </td>

            <td>
              {!b.website ? (
                "No Email"
              ) : emailMap[i] ? (
                emailMap[i].length ? emailMap[i].join(", ") : "No Email"
              ) : (
                "Fetching..."
              )}
            </td>
            {isLoggedIn && (
            <td>
              <button onClick={() => saveBusiness(b)}>Save</button>
            </td>
          )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
