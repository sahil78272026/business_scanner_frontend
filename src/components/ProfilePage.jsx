import { useEffect, useState } from "react";
import { getSavedBusinesses } from "../api";

export default function ProfilePage() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getSavedBusinesses();
      setSaved(data);
    })();
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h2>My Saved Businesses</h2>

      {saved.length === 0 && <p>No saved businesses yet.</p>}

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Website</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {saved.map((b, i) => (
            <tr key={i}>
              <td>{b.name}</td>
              <td>{b.address}</td>
              <td>{b.phone}</td>
              <td>{b.website}</td>
              <td>{b.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
