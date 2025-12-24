import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = (message, type = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);

    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

<div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }}>
  {toasts.map((t) => (
    <div
      key={t.id}
      style={{
        background: t.type === "error" ? "#ffdddd" : "#ddffdd",
        padding: "10px 14px",
        marginBottom: 8,
        borderRadius: 6,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        animation: "toastIn 0.25s ease-out",
      }}
    >
      <span>{t.message}</span>
      <button
        onClick={() =>
          setToasts((prev) => prev.filter((x) => x.id !== t.id))
        }
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ✕
      </button>
    </div>
  ))}
</div>

    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
