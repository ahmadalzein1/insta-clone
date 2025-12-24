

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
}) {


  return (
    <div
      style={{
        width: 280,
        borderRight: "1px solid #ddd",
        padding: 10,
        overflowY: "auto",
      }}
    >
      <h3>Chats</h3>

      {conversations.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelect(c)}
          style={{
            padding: 10,
            cursor: "pointer",
            background: c.id === activeId ? "#eee" : "transparent",
            borderRadius: 6,
            marginBottom: 5,
          }}
        >
          <strong>
            {c.is_group ? c.title || "Group chat" : c.other_username}
          </strong>
        </div>
      ))}
    </div>
  );
}
