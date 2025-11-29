export default function ErrorMessage({ message }) {
    if (!message) return null;
    return (
      <div style={{ color: "red", marginTop: "10px" }}>
        <strong>Error:</strong> {message}
      </div>
    );
  }
