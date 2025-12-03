import { useEffect, useState, useRef } from "react";
import { getSavedBusinesses, updateStatus, updateNotes } from "../api";

export default function ProfilePage() {
  const [saved, setSaved] = useState([]);
  const notesTimer = useRef({});


  useEffect(() => {
    (async () => {
      const data = await getSavedBusinesses();
      setSaved(data);
    })();
  }, []);

  // Update status in UI immediately after change
  const handleStatusChange = async (id, value) => {
    await updateStatus(id, value);

    setSaved((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: value } : b
      )
    );
  };

  // Update notes in UI immediately after typing
  const handleNotesChange = (id, value) => {
    // Update UI instantly
    setSaved((prev) =>
      prev.map((b) => (b.id === id ? { ...b, notes: value } : b))
    );

    // Clear the old timer
    if (notesTimer.current[id]) {
      clearTimeout(notesTimer.current[id]);
    }

    // Set a new debounce timer
    notesTimer.current[id] = setTimeout(async () => {
      await updateNotes(id, value);
      console.log("Notes saved for:", id);
    }, 600); // wait 600ms after typing stops
  };


  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <a
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "15px",
          textDecoration: "none",
          color: "#2563eb",
          fontWeight: "bold"
        }}
      >
        ← Back to Home
      </a>
      <h2>My Saved Businesses</h2>

      {saved.length === 0 && <p>No saved businesses yet.</p>}

      {saved.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {saved.map((b, i) => (
              <tr key={i}>
                <td>{b.name}</td>
                <td>{b.address}</td>
                <td>{b.phone}</td>
                <td>
                  {b.website ? (
                    <a href={b.website} target="_blank" rel="noreferrer">
                      {b.website}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{b.emails}</td>
                <td>{b.rating}</td>

                {/* ⭐ STATUS DROPDOWN */}
                <td>
                  <select
                    value={b.status || "not_contacted"}
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
                  >
                    <option value="not_contacted">Not Contacted</option>
                    <option value="contacted">Contacted</option>
                    <option value="interested">Interested</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>

                {/* ⭐ NOTES TEXTAREA */}
                <td>
                  <textarea
                    value={b.notes || ""}
                    onChange={(e) => handleNotesChange(b.id, e.target.value)}
                    placeholder="Write notes here..."
                    style={{ width: "200px", height: "70px" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
