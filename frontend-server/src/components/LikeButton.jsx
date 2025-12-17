export default function LikeButton({ post, onToggle }) {
  return (
    <button
      onClick={() => onToggle(post)}
      style={{
        border: "none",
        background: "none",
        cursor: "pointer",
        fontSize: 16,
      }}
    >
      {post.liked_by_me ? "❤️" : "🤍"} {post.likes_count}
    </button>
  );
}
