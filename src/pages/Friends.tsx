import axios from "axios";
import { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import ProfileView from "../components/ProfileView";

const Friends = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Friend Requests
  const getFriendRequests = async () => {
    try {
      const api = "http://localhost:5000/api/friendrequest/getfriendrequests";
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(api, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriendRequests(res.data.friendRequests || []);
    } catch (error) {
      console.log("Error fetching friend requests:", error);
    }
  };

  // 2. Fetch All Friends
  const getAllFriends = async () => {
    try {
      const api = "http://localhost:5000/api/friendrequest/getAllFriends";
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(api, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(res.data.friends || []);
    } catch (error) {
      console.log("Error fetching friends:", error);
    }
  };

  // 3. Fetch Rejected Requests
  const getRejectedRequests = async () => {
    try {
      const api = "http://localhost:5000/api/friendrequest/rejected";
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(api, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRejectedRequests(res.data.rejectedRequests || []);
    } catch (error) {
      console.log("Error fetching rejected requests:", error);
    }
  };

  // 4. Handle Accept/Reject Actions
  const handleRequestAction = async (
    requestId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        "http://localhost:5000/api/friendrequest/stauschange",
        { requestId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      getFriendRequests();

      if (status === "accepted") {
        getAllFriends();
      } else if (status === "rejected") {
        // Refresh rejected requests list if we're on the rejected tab
        if (activeTab === "rejected") {
          getRejectedRequests();
        }
      }
    } catch (error) {
      console.log("Error updating friend request", error);
    }
  };

  // 5. Fetch data when tab changes
  useEffect(() => {
    setLoading(true);

    if (activeTab === "friends") {
      getAllFriends();
    } else if (activeTab === "pending") {
      getFriendRequests();
    } else if (activeTab === "rejected") {
      getRejectedRequests();
    }

    setLoading(false);
  }, [activeTab]);

  // 6. Initial data fetch
  useEffect(() => {
    getFriendRequests();
    getAllFriends();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "friends":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Friends</h2>
            {friends.length === 0 ? (
              <p>No Friends Found</p>
            ) : (
              <ul className="space-y-3">
                {friends.map((friend) => (
                  <li key={friend._id}>
                    <ProfileView
                      name={friend.name}
                      image={friend.profilePic || "https://via.placeholder.com/150"}
                      email={friend.email}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "pending":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Pending Requests</h2>
            {friendRequests.length === 0 ? (
              <p>No pending requests</p>
            ) : (
              <ul className="space-y-3">
                {friendRequests.map((request) => (
                  <li key={request._id}>
                    <ProfileCard
                      name={request.from.name}
                      image={request.from.profilePic || "https://via.placeholder.com/150"}
                      onAccept={() => handleRequestAction(request._id, "accepted")}
                      onReject={() => handleRequestAction(request._id, "rejected")}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "rejected":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Rejected Requests</h2>
            {rejectedRequests.length === 0 ? (
              <p>No rejected requests</p>
            ) : (
              <ul className="space-y-3">
                {rejectedRequests.map((request) => (
                  <li key={request._id} className="bg-white p-4 rounded shadow">
                    <div className="flex items-center">
                      <img
                        src={request.from.profilePic || "https://via.placeholder.com/150"}
                        alt={request.from.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{request.from.name}</h3>
                        <p className="text-sm text-gray-500">{request.from.email}</p>
                        <div className="flex items-center mt-2">
                          <span className={`px-2 py-1 rounded text-xs ${request.direction === 'sent'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                            }`}>
                            {request.direction === 'sent'
                              ? 'You sent, they rejected'
                              : 'They sent, you rejected'}
                          </span>
                          <span className="text-xs text-gray-400 ml-4">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen bg-gray-200 flex">
      {/* LEFT PANEL */}
      <div className="w-1/5 bg-white border-r p-4 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Profile</h2>

        <ul className="space-y-4">
          <li
            className={`cursor-pointer hover:text-blue-600 ${activeTab === "friends" ? "font-semibold text-blue-600" : ""
              }`}
            onClick={() => setActiveTab("friends")}
          >
            My Friends {friends.length > 0 && `(${friends.length})`}
          </li>

          <li
            className={`cursor-pointer hover:text-blue-600 ${activeTab === "pending" ? "font-semibold text-blue-600" : ""
              }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Friend Request {friendRequests.length > 0 && `(${friendRequests.length})`}
          </li>

          <li
            className={`cursor-pointer hover:text-blue-600 ${activeTab === "rejected" ? "font-semibold text-blue-600" : ""
              }`}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected Friend Request {rejectedRequests.length > 0 && `(${rejectedRequests.length})`}
          </li>
        </ul>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-4/5 p-8 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Friends;