import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { Chatcontext } from "../../Context/Chatcontext";
import { Authcontext } from "../../Context/Authcontext";

const Chatbar = ({ isOpen, setIsOpen }) => {
  const { selectedUser, messages } = useContext(Chatcontext);
  const { logout, onlineuser } = useContext(Authcontext);

  const [messageimage, setmessageimage] = useState([]);

  useEffect(() => {
    const imgs = messages
      .filter((msg) => msg.image)
      .map((msg) => msg.image);
    setmessageimage(imgs);
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div
      className={`
        text-white bg-white/5 backdrop-blur-md h-full

        /* 📱 MOBILE */
        fixed top-0 right-0 z-50 w-full sm:w-[350px]
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}

      `}
    >
      {/* Close (mobile only) */}
      <button
        className="absolute top-4 right-4 sm:hidden text-white text-xl"
        onClick={() => setIsOpen(false)}
      >
        ✕
      </button>

      {/* Profile */}
      <div className="px-6 py-6 space-y-4 text-center">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
          className="w-24 h-24 rounded-full mx-auto object-cover"
        />

        <div className="flex items-center justify-center gap-2">
          {onlineuser.includes(selectedUser._id?.toString()) ? (
            <>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-xs text-green-400">Online</span>
            </>
          ) : (
            <span className="text-xs text-gray-400">Offline</span>
          )}

          <h1 className="text-xl font-semibold">
            {selectedUser.fullName}
          </h1>
        </div>

        <p className="text-sm text-gray-400">
          {selectedUser.bio || "No bio available"}
        </p>
      </div>

      <hr className="border-gray-700 my-4 mx-6" />

      {/* Media */}
      <div className="px-6 pb-20">
        <p className="text-sm text-gray-400 mb-3">Media</p>

        <div className="grid grid-cols-3 gap-3">
          {messageimage.length > 0 ? (
            messageimage.map((url, i) => (
              <img
                key={i}
                src={url}
                className="w-full h-24 object-cover rounded-md cursor-pointer"
                onClick={() => window.open(url, "_blank")}
              />
            ))
          ) : (
            <p className="col-span-3 text-gray-500 text-sm">
              No media found
            </p>
          )}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 px-20 py-2 rounded-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Chatbar;