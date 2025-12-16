import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const API = "http://localhost:5000";

export default function ProfilePage() {
  const { id } = useParams();
  const { user: me } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    const res = await axios.get(`/api/users/${id}`);
    setProfile(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
    
  }, [id]);

  const follow = async () => {
    await axios.post(`/api/follow/${id}`);
    loadProfile();
  };

  const unfollow = async () => {
    await axios.delete(`/api/follow/${id}`);
    loadProfile();
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>Not found</p>;

  const { user, posts,stats, isFollowing } = profile;
  const isMe = me.id === user.id;

  return (
    <div>
      <h2>@{user.username}</h2>
      {/* STATS */}
      <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
        <strong>{stats.posts_count} posts</strong>
        <strong>{stats.followers_count} followers</strong>
        <strong>{stats.following_count} following</strong>
      </div>
       {/* STATS */}
      {!isMe && (
        <button onClick={isFollowing ? unfollow : follow}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}

      <h3 style={{ marginTop: 20 }}>Posts</h3>

      {posts.length === 0 && <p>No posts yet</p>}

      {posts.map((p) => (
    <div key={p.id} >    <img
          
          src={`${API}/${p.image}`}
          alt=""
          style={{ width: "100%", marginBottom: 10, borderRadius: 10 }}
        /><p>{p.caption}</p></div>
      ))}
    </div>
  );
}
