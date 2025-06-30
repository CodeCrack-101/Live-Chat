import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { Chatcontext } from "../../Context/Chatcontext";
import { Authcontext } from "../../Context/Authcontext";

const Chatbar = () => {
  const { selectedUser, messages } = useContext(Chatcontext);
  const { logout, onlineuser } = useContext(Authcontext);

  const [messageimage, setmessageimage] = useState([]);

  // ✅ Get all images from all messages (sender + receiver)
  useEffect(() => {
    const imgs = messages
      .filter((msg) => msg.image)
      .map((msg) => msg.image);
    setmessageimage(imgs);
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div className="text-white w-full h-full bg-white/5 backdrop-blur-md rounded-r-xl overflow-y-auto relative">
      {/* Profile Info */}
      <div className="px-6 py-6 space-y-4 text-center">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt={selectedUser?.fullName}
          className="w-24 h-24 rounded-full mx-auto object-cover"
        />

        <div className="flex items-center justify-center gap-2">
        {onlineuser.includes(selectedUser._id?.toString()) ? (
  <>
    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
    <span className="text-xs text-green-400">Online</span>
  </>
) : (
  <span className="text-xs text-gray-400">Offline</span>
)}

          <h1 className="text-xl font-semibold">{selectedUser.fullName}</h1>
        </div>

        <p className="text-sm text-gray-400">
          {selectedUser.bio || "No bio available"}
        </p>
      </div>

      <hr className="border-gray-700 my-4 mx-6" />

      {/* Media Section */}
      <div className="px-6 pb-6">
        <p className="text-sm text-gray-400 mb-3 font-medium">Media</p>
        <div className="grid grid-cols-3 gap-3">
          {messageimage.length > 0 ? (
            messageimage.map((url, index) => (
             <img
  key={index}
  src={url}
  alt={`media-${index}`}
  className="w-full h-24 object-cover rounded-md cursor-pointer"
  onClick={() => window.open(url, "_blank")}
/>

            ))
          ) : (
            <p className="col-span-3 text-gray-500 text-sm">No media found</p>
          )}
        </div>
      </div>

      <button
        onClick={logout}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default Chatbar;
