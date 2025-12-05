import React from "react";

interface NotificationItemProps {
  notification: {
    _id: string;
    from: { name: string; profilePic: string };
    post?: { text?: string; imageUrl?: string };
    isChecked: boolean;
    createdAt: string;
    type: string;
    message?: string;
  };
  onMarkChecked: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkChecked,
}) => {
  const { _id, from, post, isChecked, createdAt, type } = notification;

  
  let message = notification.message;
  if (!message) {
    if (type === "like") message = `${from.name} liked your post`;
    else if (type === "comment") message = `${from.name} commented on your post`;
    else message = `${from.name} sent a notification`;
  }

  return (
    <div
      className={`flex items-start p-3 border rounded-md gap-3 ${
        isChecked ? "bg-white" : "bg-blue-50"
      }`}
    >
      
      <img
        src={from.profilePic || "/default-avatar.png"}
        alt={from.name}
        className="w-12 h-12 rounded-full object-cover"
      />

      
      <div className="flex-1">
        <p className="text-gray-800">{message}</p>
        {post?.text && <p className="text-sm text-gray-500 mt-1">"{post.text}"</p>}
        {post?.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post preview"
            className="w-24 h-24 object-cover mt-1 rounded"
          />
        )}
        <p className="text-xs text-gray-400 mt-1">
          {createdAt ? new Date(createdAt).toLocaleString() : ""}
        </p>
      </div>

      
      {!isChecked && (
        <button
          onClick={() => onMarkChecked(_id)}
          className="text-blue-500 text-sm font-semibold"
        >
          Mark as read
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
