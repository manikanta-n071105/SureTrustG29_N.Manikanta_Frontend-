                                                                                                                                                             import React from "react";
import NotificationItem from "../components/NotificationItem";

const NotificationPage = () => {
  return (
    <div>
      <NotificationItem time="10 min ago" message="Aman liked your post" />
      <NotificationItem time="1 hour ago" message="Riya commented on your photo" />
    </div>
  );
};

export default NotificationPage;