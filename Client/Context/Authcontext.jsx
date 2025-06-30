import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const Authcontext = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const Authprovider = ({ children }) => {
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [authuser, setauthuser] = useState(null);
  const [onlineuser, setonlineuser] = useState([]);
  const [socket, setsocket] = useState(null);

  const checkauth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setauthuser(data.user);
        connectsocket(data.user);
      }
    } catch (error) {
      toast.error("Auth check failed");
    }
  };

  const login = async (type, payload) => {
    try {
      const res = await axios.post(`${backendUrl}/api/auth/${type}`, payload);
      if (res.data.success) {
        setauthuser(res.data.userdata || res.data.user);
        settoken(res.data.token);
        localStorage.setItem("token", res.data.token);
        return true;
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    settoken(null);
    setauthuser(null);
    setonlineuser([]);
    delete axios.defaults.headers.common["token"];
    socket?.disconnect();
    toast.success("Logged out successfully");
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/updateprofile", body);
      if (data.success) {
        setauthuser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Update failed: " + error.message);
    }
  };

  const connectsocket = (userdata) => {
    if (!userdata || socket?.connected) return;

    const newsocket = io(backendUrl, {
      query: { userId: userdata._id },
    });

    newsocket.connect();
    setsocket(newsocket);

    // ✅ Fix this event listener
    newsocket.on("Get Online User", (userids) => {
      if (Array.isArray(userids)) {
        setonlineuser(userids.map(id => id.toString()));
      } else {
        setonlineuser([]);
      }
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkauth();
    }
  }, [token]);

  return (
    <Authcontext.Provider
      value={{
        axios,
        authuser,
        onlineuser,
        socket,
        login,
        logout,
        connectsocket,
        updateProfile,
      }}
    >
      {children}
    </Authcontext.Provider>
  );
};
