import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import AvatarUploader from "../components/AvatarUploader.jsx";

const API = "http://localhost:5000";

export default function ProfilePage() {
  const navigate = useNavigate();

  const { id } = useParams();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);



const startConversation = async () => {
  try {
    const res = await axios.post(
      "/api/chat/conversations/one",
      { otherUserId: profile.user.id }
    );

    const conversationId = res.data.conversationId;

    // navigate to chat and pass conversationId
    navigate("/chat", {
      state: { conversationId },
    });
  } catch (err) {
    console.error(err);
  }
};




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
      <h2 style={{display:"flex"}}>@{user.username}       {!isMe && (
                    <img
        src={

            user.avatar?`${API}/uploads/${user.avatar}`
            : "https://via.placeholder.com/120"
        }
        alt="avatar"
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          objectFit: "cover",
        
           
        }}
      />
)}</h2>

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

      {!isMe && (
  <button
    style={{ marginLeft: 10 }}
    onClick={startConversation}
  >
    Message
  </button>
)}


{isMe && (
  <AvatarUploader
    currentAvatar={user.avatar}
    onUpdated={loadProfile}
  />
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
