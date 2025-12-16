import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState([]);

  const search = async (value) => {
    setQ(value);

    if (!value.trim()) {
      setUsers([]);
      return;
    }
try
    {const res = await axios.get(`/api/users/search?q=${value}`);
    setUsers(res.data);
}catch(e){console.log(e)}

    
  };

  return (
    <div>
      <h2>Search users</h2>

      <input
        placeholder="Search by username..."
        value={q}
        onChange={(e) => search(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <div style={{ marginTop: 10 }}>
        {users.map((u) => (
          <Link
            key={u.id}
            to={`/profile/${u.id}`}
            style={{ display: "block", padding: 8 }}
          >
            @{u.username}
          </Link>
        ))}
      </div>
    </div>
  );
}
