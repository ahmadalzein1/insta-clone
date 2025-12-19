import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const [uRes, pRes] = await Promise.all([
      axios.get("/api/admin/users"),
      axios.get("/api/admin/posts"),
    ]);
    setUsers(uRes.data);
    setPosts(pRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ optimistic ban/unban + rollback
  const toggleBan = async (user) => {
    const oldUser = { ...user };

    // 1) optimistic update
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, banned: !u.banned } : u))
    );

    try {
      // 2) backend
      const res = await axios.put(`/api/admin/users/${user.id}/ban`);

      // 3) sync with backend response (source of truth)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, banned: res.data.banned } : u
        )
      );
    } catch (err) {
      console.error("Ban failed, rollback", err);

      // 4) rollback
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? oldUser : u))
      );
    }
  };

  // ✅ optimistic delete post + rollback
  const deletePost = async (post) => {
    const oldPosts = posts; // snapshot array reference is fine if we re-set it on rollback

    // 1) optimistic remove
    setPosts((prev) => prev.filter((p) => p.id !== post.id));

    try {
      // 2) backend
      await axios.delete(`/api/admin/posts/${post.id}`);
    } catch (err) {
      console.error("Delete failed, rollback", err);

      // 3) rollback restore
      setPosts(oldPosts);
    }
  };

  if (loading) return <p>Loading admin data...</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h3>Users</h3>
      {users.map((u) => (
        <div
          key={u.id}
          style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}
        >
          <span>
            @{u.username} {u.role === "admin" ? "(admin)" : ""}{" "}
            {u.banned ? "🚫" : ""}
          </span>
          <button onClick={() => toggleBan(u)}>
            {u.banned ? "Unban" : "Ban"}
          </button>
        </div>
      ))}

      <h3 style={{ marginTop: 20 }}>Posts</h3>
      {posts.map((p) => (
        <div
          key={p.id}
          style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}
        >
          <span>
            Post #{p.id} by @{p.username}
          </span>
          <button onClick={() => deletePost(p)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
