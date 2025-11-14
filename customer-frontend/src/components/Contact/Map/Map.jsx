export const Map = () => {
  return (
    <div className="contacts-map" style={{ marginTop: "20px" }}>
      <iframe
        src="https://www.google.com/maps?q=-36.8201,-73.0444&z=15&output=embed"
        width="100%"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
      ></iframe>
    </div>
  );
};
