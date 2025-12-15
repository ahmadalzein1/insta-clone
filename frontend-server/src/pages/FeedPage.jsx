import React, { useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "../components/CreatePost.jsx";

const API = "http://localhost:5000"; // used only for image URLs

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/posts/feed");
      setPosts(res.data);
     
    } catch(e){console.log(e)}
     finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <div>
      <CreatePost onCreated={() => loadFeed()} />

      <h2 style={{ marginTop: 0 }}>Feed</h2>

      {loading && <p>Loading...</p>}

      {!loading && posts.length === 0 && <p>No posts yet.</p>}

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ddd",
            marginBottom: 20,
            padding: 12,
            borderRadius: 10,
          }}
        >
          <strong>@{post.username}</strong>

          <img
            src={`${API}/${post.image}`}
            alt=""
            style={{ width: "100%", marginTop: 10, borderRadius: 10 }}
          />

          {post.caption && <p style={{ marginBottom: 0 }}>{post.caption}</p>}
        </div>
      ))}
    </div>
  );
}
