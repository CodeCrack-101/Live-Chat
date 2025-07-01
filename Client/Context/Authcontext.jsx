import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const Authcontext = createContext();

// ✅ Backend URL from environment
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

// ✅ Restore token from localStorage and set header
const savedToken = localStorage.getItem("token");
if (savedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

export const Authprovider = ({ children }) => {
  const [token, settoken] = useState(savedToken);
  const [authuser, setauthuser] = useState(null);
  const [onlineuser, setonlineuser] = useState([]);
  const [socket, setsocket] = useState(null);

  // ✅ Check if token is valid on load
  const checkauth = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get("/api/auth/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setauthuser(data.user);
        connectsocket(data.user);
        console.log("✅ Auth check passed");
      } else {
        throw new Error("Auth failed");
      }
    } catch (error) {
      console.error("❌ Auth check failed:", error.message);
      logout();
      toast.error("Session expired, please login again.");
    }
  };

  // ✅ Login / Signup handler
  const login = async (type, payload) => {
    try {
      const res = await axios.post(`/api/auth/${type}`, payload);

      if (res.data.success) {
        const user = res.data.userdata || res.data.user; // handle both keys
        const newToken = res.data.token;

        setauthuser(user);
        settoken(newToken);
        localStorage.setItem("token", newToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        connectsocket(user);
        toast.success("Login successful");
        return true;
      } else {
        toast.error(res.data.message || "Login failed");
        return false;
      }
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      toast.error("Something went wrong during login");
      return false;
    }
  };

  // ✅ Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    settoken(null);
    setauthuser(null);
    setonlineuser([]);
    delete axios.defaults.headers.common["Authorization"];
    socket?.disconnect();
    setsocket(null);
    toast.success("Logged out successfully");
  };

  // ✅ Profile updater
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/updateprofile", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setauthuser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Update failed: " + error.message);
    }
  };

  // ✅ Connect to socket.io
  const connectsocket = (userdata) => {
    if (!userdata || socket?.connected) return;

    const newsocket = io(backendUrl, {
      query: { userId: userdata._id },
      transports: ["websocket"],
    });

    newsocket.connect();
    setsocket(newsocket);

    newsocket.on("Get Online User", (userids) => {
      if (Array.isArray(userids)) {
        setonlineuser(userids.map((id) => id.toString()));
      } else {
        setonlineuser([]);
      }
    });
  };

  // ✅ Run on first load
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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
