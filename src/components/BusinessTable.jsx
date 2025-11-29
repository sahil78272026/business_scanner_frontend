import "../styles/table.css";

export default function BusinessTable({ businesses }) {
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
