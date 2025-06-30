// Chatcontext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { Authcontext } from "./Authcontext";
import toast from "react-hot-toast";

export const Chatcontext = createContext(); // ✅ Capitalized export

export const Chatprovider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(Authcontext);

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenmessage);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getMessages = async () => {
    if (!selectedUser?._id) return;
    try {
      const { data } = await axios.get(`/api/messages/${selectedUser._id}`);
      if (data.success) {
        setMessages(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newmessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser]);

  return (
    <Chatcontext.Provider
      value={{
        messages,
        users,
        selectedUser,
        setSelectedUser,
        unseenMessages,
        getUsers,
        getMessages,
        sendMessage,
      }}
    >
      {children}
    </Chatcontext.Provider>
  );
};
