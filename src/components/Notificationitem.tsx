                                                                                                                                                       
   
const NotificationItem = ({ time, message }) => {
  return (
    <div style={styles.container}>
      <span style={styles.time}>{time}</span>
      <span style={styles.message}>{message}</span>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
  time: {
    color: "gray",
    fontSize: "14px",
  },
  message: {
    fontWeight: "500",
    fontSize: "15px",
  },
};

export default NotificationItem;