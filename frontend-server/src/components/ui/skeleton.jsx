export default function Skeleton({ width = "100%", height = 16 }) {
  return (
    <div
      style={{
        width,
        height,
        background: "linear-gradient(90deg, #eee, #f5f5f5, #eee)",
        backgroundSize: "200% 100%",
        animation: "pulse 1.5s infinite",
        borderRadius: 6,
      }}
    />
  );
}
