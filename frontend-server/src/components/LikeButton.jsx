import axios from "axios";

export default function LikeButton({ postId, liked, count, onChange }) {
  const toggleLike = async () => {
    if (liked) {
      await axios.delete(`/api/likes/${postId}`);
    } else {
      await axios.post(`/api/likes/${postId}`);
    }
    onChange(); // refresh feed or update state
  };

  return (
    <button onClick={toggleLike} style={{ border: "none", background: "none" }}>
      {liked ? "❤️" : "🤍"} {count}
    </button>
  );
}
