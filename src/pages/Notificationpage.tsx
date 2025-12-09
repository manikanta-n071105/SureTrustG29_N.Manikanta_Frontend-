import React, { useEffect, useState } from "react";
// @ts-ignore
import { getAllNotifications, markAsChecked, markAllAsChecked } from "../api/notificationApi";
import NotificationItem from "../components/Notificationitem";

export interface NotificationData {
  _id: string;
  from: {
    name: string;
    profilePic: string;
  };
  post?: {
    text?: string;
    imageUrl?: string;
  };
  checked: boolean;
  createdAt: string;
  type: string;
  message?: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getAllNotifications();
        console.log("API RESPONSE =", response.data);

        const notificationsWithChecked = (response.data.notifications || []).map((n: any) => ({
        ...n,
        checked: n.checked,
      }));
      setNotifications(notificationsWithChecked);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsChecked = async (id: string) => {
    try {
      await markAsChecked(id);

      
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, checked: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification:", error);
    }
  };

  const handleMarkAllAsChecked = async () => {
  try {
    await markAllAsChecked();
    setNotifications(prev => prev.map(n => ({ ...n, checked: true })));
  } catch (error) {
    console.error("Error marking all notifications:", error);
  }
};


  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <button
          onClick={handleMarkAllAsChecked}
          className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
        >
          Mark All as Read
        </button>
      </div>


      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((notif) => (
            <NotificationItem
              key={notif._id}
              notification={notif}
              onMarkChecked={handleMarkAsChecked}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
