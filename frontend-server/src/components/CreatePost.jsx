import React, { useState } from "react";
import axios from "axios";

export default function CreatePost({ onCreated }) {
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);

    if (file) {
      const url = URL.createObjectURL(file);
     
      setPreview(url);
    } else {
      setPreview("");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!imageFile) {
      setError("Please choose an image.");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("image", imageFile);     // MUST be "image"
      fd.append("caption", caption);

      const res = await axios.post("/api/posts", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // reset
      setCaption("");
      setImageFile(null);
      setPreview("");

      // tell parent to refresh feed
      onCreated?.(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Create post failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10, marginBottom: 16 }}>
      <h3 style={{ marginTop: 0 }}>Create Post</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input type="file" accept="image/*" onChange={pickImage} />

        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{ width: "100%", maxHeight: 350, objectFit: "cover", borderRadius: 10 }}
          />
        )}

        <input
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button disabled={loading} type="submit">
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
