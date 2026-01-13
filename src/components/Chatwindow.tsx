import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../utils/socket";
import { baseUrl } from "../baseUrl";

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow = ({ onClose }: ChatWindowProps) => {
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
    console.log(msg,'kokoko');
    
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
      `${baseUrl}/friendrequest/getAllFriends`,
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
      `${baseUrl}/chat/conversations/${user._id}`,
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
const name=localStorage.getItem("name")
  const newMessage = {
   content:text,
   sender:"me"
  };
setMessages((prev)=>[...prev,newMessage])
    setText("");
  };

  return (
    <div className="w-[360px] h-[460px] bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-red-600 to-rose-500 text-white px-4 py-3 flex justify-between items-center">
        <span className="font-semibold">
          {selectedUser ? selectedUser.name : "Chats"}
        </span>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Friends */}
        <div className="w-1/3 border-r border-gray-200 text-sm overflow-y-auto bg-white">
          {friends.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className={`px-3 py-3 cursor-pointer transition-all
              hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50
              ${
              selectedUser?._id === user._id
              ? "bg-linear-to-r from-red-50 to-rose-50 font-semibold text-red-600"
              : "text-gray-700"
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
                      className={`px-3 py-2 rounded-xl max-w-[80%] shadow-sm ${
                      msg.sender === "me"
                    ? "bg-linear-to-r from-red-600 to-rose-500 text-white"
                     : "bg-white border border-gray-200 text-gray-700"
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
            <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
              {/* <input type="file" /> */}
              <button className="p-2 text-gray-500">
                {/* <ImageIcon size={18} /> */}
              </button>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="Type a message"
              />
              <button
                onClick={handleSend}
                className="bg-linear-to-r from-red-600 to-rose-500 text-white px-4 py-2 rounded-full font-semibold shadow-md"
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
  sender: msg.from.name === localStorage.getItem("name") ? "me" : "friend",
  content: msg.message,
});
