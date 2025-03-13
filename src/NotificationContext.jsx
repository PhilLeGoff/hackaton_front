import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children, user }) => {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null); // ✅ Keep socket instance across renders

  useEffect(() => {
    if (user && user._id) { // ✅ Ensure user._id exists before connecting
      if (!socketRef.current) {
        socketRef.current = io(import.meta.env.VITE_API_URL, {
          transports: ["websocket"],
        });

        // 🔥 Send the user ID after connection
        socketRef.current.emit("user_connected", user._id);

        socketRef.current.on("notification", (notification) => {
          setNotifications((prev) => [...prev, notification]);
          showNotification(notification);
        });
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  const showNotification = (notification) => {
    const { type, tweetId } = notification;

    console.log("toasting")
    if (type === "like") {
      toast.info("💙 Your emote was liked!", { position: "top-right", autoClose: 3000 });
    } else if (type === "retweet") {
      toast.info("🔄 Your tweet was retweeted!", { position: "top-right", autoClose: 3000 });
    } else if (type === "comment") {
      toast.info("💬 Someone commented on your tweet!", { position: "top-right", autoClose: 3000 });
    } else if (type === "save") {
      toast.info("💬 Someone saved your tweet!", { position: "top-right", autoClose: 3000 });
    } else if (type === "mentionTweet") {
      toast.info("💬 Someone mentioned you in their tweet!", { position: "top-right", autoClose: 3000 });
    } else if (type === "mentionComment") {
      toast.info("💬 Someone mentioned you in their comment!", { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
