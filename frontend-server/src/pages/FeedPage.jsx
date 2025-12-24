import React, { useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "../components/CreatePost.jsx";
import LikeButton from "../components/LikeButton.jsx";
import Comments from "../components/Comments.jsx";
import Skeleton from "../components/ui/skeleton.jsx";
import {useToast}  from "../contexts/ToastContext.jsx"
const API = "http://localhost:5000"; // used only for image URLs

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
const { show } = useToast();

  const loadFeed = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/posts/feed");
      setPosts(res.data);
     setLoading(false);
    } catch(e){show("Failed to load feed refresh", "error");}
 

  };

  useEffect(() => {
    loadFeed();
  }, []);








  // 🔥 THIS is the optimistic + rollback handler
  const toggleLikeOptimistic = async (post) => {
    // 1️⃣ save old snapshot (for rollback)
    const oldPost = { ...post };

    // 2️⃣ optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              liked_by_me: !p.liked_by_me,
              likes_count:
                Number(p.likes_count) + (p.liked_by_me ? -1 : 1),
            }
          : p
      )
    );

    // 3️⃣ backend request
    try {
      if (post.liked_by_me) {
        await axios.delete(`/api/likes/${post.id}`);
        show("unlike", "info");
      } else {
        await axios.post(`/api/likes/${post.id}`);
        show("like", "info");
      }
    } catch (err) {
      console.error("Like failed, rolling back", err);
show("like operation failed", "error");
      // 4️⃣ rollback if failed
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? oldPost : p))
      );
    }
  };


  
  return (
    <div>
      <CreatePost onCreated={() => loadFeed()} />

      <h2 style={{ marginTop: 0 }}>Feed</h2>

      {loading &&
  Array.from({ length: 3 }).map((_, i) => (
    <div key={i} style={{ marginBottom: 20 }}>
      <Skeleton height={200} />
      <Skeleton width="60%" />
    </div>
  ))}


     {!loading && posts.length === 0 && (
  <div style={{ textAlign: "center", marginTop: 40 }}>
    <h3>No posts yet</h3>
    <p>Follow people to see their posts.</p>
  </div>
)}


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
          <div style={{display:"flex"}}><strong>@{post.username}</strong>
                    <img
        src={

            post.avatar?`${API}/uploads/${post.avatar}`
            : "https://via.placeholder.com/120"
        }
        alt="avatar"
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          objectFit: "cover",
        
          
        }}
      /></div>
          <img
            src={`${API}/${post.image}`}
            alt=""
            style={{ width: "100%", marginTop: 10, borderRadius: 10 }}
          />

          {post.caption && <p style={{ marginBottom: 0 }}>{post.caption}</p>}
          <LikeButton
post={post}
onToggle={toggleLikeOptimistic}
/>
 
<Comments
  postId={post.id}
  initialCount={post.comments_count}
/>




        </div>
      ))}
    </div>
  );
}
