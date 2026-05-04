import { useState, useRef, useEffect } from "react";

export default function Chat({ user }) {
    const fakeUsers = [
        { name: "Tony", status: "online" },
        { name: "Peter", status: "online" },
        { name: "Steve", status: "offline" },
        { name: "Natasha", status: "online" },
    ];

    const [selectedUser, setSelectedUser] = useState(fakeUsers[0].name);
    const [chats, setChats] = useState(() => {
        const saved = localStorage.getItem("chats");
        return saved ? JSON.parse(saved) : {};
    });

    const [input, setInput] = useState("");
    const [typingUser, setTypingUser] = useState(null);
    const bottomRef = useRef(null);

    const getRandomReply = () => {
        const replies = [
            "Nice!",
            "I agree",
            "That’s interesting",
            "Tell me more",
            "😂",
            "Okay got it",
            "Hmm...",
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    };

    const sendMessage = () => {
        if (!input.trim()) return;

        const newMessage = {
            text: input,
            sender: user,
            time: new Date().toLocaleTimeString(),
            status: "sent",
        };

        const updatedChat = [...(chats[selectedUser] || []), newMessage];

        setChats({
            ...chats,
            [selectedUser]: updatedChat,
        });

        setInput("");

        // simulate read ticks
        setTimeout(() => {
            setChats((prev) => ({
                ...prev,
                [selectedUser]: prev[selectedUser].map((msg, i) =>
                    i === prev[selectedUser].length - 1
                        ? { ...msg, status: "read" }
                        : msg
                ),
            }));
        }, 1000);

        // typing + reply
        setTypingUser(selectedUser);

        setTimeout(() => {
            const fakeReply = {
                text: getRandomReply(),
                sender: selectedUser,
                time: new Date().toLocaleTimeString(),
            };

            setChats((prev) => ({
                ...prev,
                [selectedUser]: [...(prev[selectedUser] || []), fakeReply],
            }));

            setTypingUser(null);
        }, 1500 + Math.random() * 2000);
    };

    useEffect(() => {
        localStorage.setItem("chats", JSON.stringify(chats));
    }, [chats]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats, selectedUser, typingUser]);

    const currentMessages = chats[selectedUser] || [];

    return (
        <div className="app-container">
            {/* Sidebar */}
            <div className="sidebar">
                <h3>Chats</h3>

                {fakeUsers.map((u, i) => (
                    <div
                        key={i}
                        className="chat-user"
                        onClick={() => setSelectedUser(u.name)}
                        style={{
                            background: selectedUser === u.name ? "#2a3942" : "transparent",
                            borderLeft:
                                selectedUser === u.name ? "4px solid #00a884" : "none",
                            cursor: "pointer",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div className="avatar">{u.name[0]}</div>

                            <div>
                                <div>{u.name}</div>
                                <small style={{ opacity: 0.6 }}>
                                    {(chats[u.name]?.slice(-1)[0]?.text) || "No messages"}
                                </small>
                            </div>
                        </div>

                        <span className={u.status === "online" ? "online" : "offline"}>
                            ●
                        </span>
                    </div>
                ))}
            </div>

            {/* Chat */}
            <div className="chat-container">
                <div
                    className="chat-header"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span>{selectedUser}</span>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            onClick={() => {
                                if (window.confirm("Clear this chat?")) {
                                    setChats((prev) => ({
                                        ...prev,
                                        [selectedUser]: [],
                                    }));
                                }
                            }}
                        >
                            🗑
                        </button>

                        <button
                            onClick={() => {
                                localStorage.removeItem("user");
                                window.location.reload();
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="messages">
                    {currentMessages.map((msg, index) => (
                        <div
                            key={index}
                            className={msg.sender === user ? "message me" : "message"}
                        >
                            <p>{msg.text}</p>

                            <span>
                                {msg.time}{" "}
                                {msg.sender === user && (
                                    <span style={{ marginLeft: "5px", fontSize: "10px" }}>
                                        {msg.status === "read" ? "✓✓" : "✓"}
                                    </span>
                                )}
                            </span>
                        </div>
                    ))}

                    {typingUser === selectedUser && (
                        <div className="typing">{selectedUser} is typing...</div>
                    )}

                    <div ref={bottomRef}></div>
                </div>

                <div className="input-box">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") sendMessage();
                        }}
                        placeholder="Type message..."
                    />
                    <button onClick={sendMessage}>➤</button>
                </div>
            </div>
        </div>
    );
}