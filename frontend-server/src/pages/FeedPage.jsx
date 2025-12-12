import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

const FeedPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>Home Feed</h2>
      <p>Welcome @{user.username}! Feed will show posts here soon.</p>
    </div>
  );
};

export default FeedPage;
