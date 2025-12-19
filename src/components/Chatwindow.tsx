import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../utils/socket";

const ChatWindow = ({ onClose }) => {
  interface Message {
    id: string;
    sender: string;
    content: string;
  }

  const [friends, setFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("token");

  /* ---------- SOCKET SETUP ---------- */
  useEffect(() => {
  socket.connect();
  socket.emit("setup", token);

  socket.on("receive_message", (msg) => {
    //show event
    console.log(msg);
    
    setMessages((prev) => [...prev, formatMessage(msg)]);
  });

  return () => {
    socket.off("receive_message");
    socket.disconnect();
  };
}, );



  /* ---------- FETCH FRIENDS ---------- */
  const getAllFriends = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:5000/api/friendrequest/getAllFriends",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setFriends(res.data.friends);
  };

  useEffect(()=>{
    getAllFriends()
  },[])

  /* ---------- FETCH CONVERSATION ---------- */
  const handleSelectUser = async (user) => {
    setSelectedUser(user);

    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:5000/api/chat/conversations/${user._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const formatted = res.data.conversations
      .reverse()
      .map(formatMessage);

    setMessages(formatted);
  };

  /* ---------- SEND MESSAGE ---------- */
  const handleSend = () => {
    if (!text.trim() || !selectedUser) return;

    socket.emit("send_message", {
      from: token,
      to: selectedUser._id,
      message: text,
    });

    setText("");
  };

  return (
    <div className="w-[320px] h-[400px] bg-white rounded-lg shadow-2xl flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">
          {selectedUser ? selectedUser.name : "Chats"}
        </span>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Friends */}
        <div className="w-1/3 border-r text-sm overflow-y-auto">
          {friends.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                selectedUser?._id === user._id ? "bg-gray-200 font-bold" : ""
              }`}
            >
              {user.name}
            </div>
          ))}
        </div>

        {/* Messages */}
        <div className="w-2/3 flex flex-col">
          <div className="flex-1 p-3 space-y-2 overflow-y-auto text-sm">
            {selectedUser ? (
              messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[80%] ${
                        msg.sender === "me"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No messages yet</p>
              )
            ) : (
              <p className="text-gray-500 text-center">Select a friend</p>
            )}
          </div>

          {/* Input */}
          {selectedUser && (
            <div className="p-2 border-t flex items-center gap-1">
              {/* <input type="file" /> */}
              <button className="p-2 text-gray-500">
                {/* <ImageIcon size={18} /> */}
              </button>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder="Type a message"
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white px-3 rounded"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

const formatMessage = (msg) => ({
  id: msg._id,
  sender: msg.from._id === localStorage.getItem("userId") ? "me" : "friend",
  content: msg.message,
});
