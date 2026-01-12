import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../baseUrl";

// Define proper interfaces
interface User {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp?: string;
  to?: string;
}

interface ApiMessage {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
  };
  receiver: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

const Chatwindow: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch all users (friends)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${baseUrl}/friendrequest/getFriends`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data.friends || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle user selection and fetch messages
  const handleSelectUser = async (user: User) => {
    setSelectedUser(user);
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `${baseUrl}/message/getMessages/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const formattedMessages = response.data.messages.map((msg: ApiMessage) => ({
        id: msg._id,
        content: msg.content,
        sender: msg.sender._id,
        timestamp: msg.createdAt,
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) return;

      const messageData = {
        to: selectedUser._id,
        content: newMessage,
      };

      const newMsg: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: userId,
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");

      await axios.post(`${baseUrl}/message/send`, messageData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* USERS SIDEBAR */}
      <div className="w-full md:w-80 bg-white border-r border-gray-200 shadow-lg">
        <div className="bg-gradient-to-r from-red-600 to-rose-500 p-5 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {selectedUser ? selectedUser.name : "Chats"}
          </h2>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-88px)]">
          {users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No friends to chat with</p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 ${
                  selectedUser?._id === user._id
                    ? "bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-l-red-600"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user.profilePic || "https://via.placeholder.com/40"}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedUser ? (
          <>
            {/* CHAT HEADER */}
            <div className="bg-gradient-to-r from-red-600 to-rose-500 p-4 shadow-md">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.profilePic || "https://via.placeholder.com/40"}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                />
                <div>
                  <h3 className="font-semibold text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-red-100">Active now</p>
                </div>
              </div>
            </div>

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-semibold">No messages yet</p>
                  <p className="text-gray-400 text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const currentUserId = localStorage.getItem("userId");
                  const isMyMessage = msg.sender === currentUserId;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                          isMyMessage
                            ? "bg-gradient-to-r from-red-600 to-rose-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                        {msg.timestamp && (
                          <p
                            className={`text-xs mt-1 ${
                              isMyMessage ? "text-red-100" : "text-gray-400"
                            }`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* MESSAGE INPUT */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-full px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Select a conversation
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Choose a friend from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatwindow;
