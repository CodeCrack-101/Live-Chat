import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { formatmessagetime } from "../Library/util";
import { Chatcontext } from "../../Context/Chatcontext";
import { Authcontext } from "../../Context/Authcontext";
import toast from "react-hot-toast";
import Chatbar from "./Chatbar";

const Chat = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(Chatcontext);
  const { authuser, onlineuser } = useContext(Authcontext);

  const [input, setInput] = useState("");
  const [isChatbarOpen, setIsChatbarOpen] = useState(false);

  const isOnline = onlineuser.map(String).includes(
    selectedUser?._id?.toString()
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await sendMessage({
        text: input.trim(),
        receiverId: selectedUser._id,
      });
      setInput("");
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleNewImage = async (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Select an image");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({
        image: reader.result,
        receiverId: selectedUser._id,
      });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser]);

  return (
    <div
      className={`h-full flex relative ${
        !selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col px-4 py-3">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setIsChatbarOpen(true)}
          >
            <img
              src={selectedUser?.profilePic || assets.avatar_icon}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-white">
                {selectedUser?.fullName}
              </p>
              <span className="text-xs text-gray-400">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* BACK BUTTON */}
          <img
            src={assets.arrow_icon}
            className="md:hidden w-5 cursor-pointer"
            onClick={() => setSelectedUser(null)}
          />
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto py-5 px-5">
          {messages.map((msg, i) => {
            const isSender =
              msg.senderId?.toString() === authuser?._id?.toString();

            return (
              <div
                key={i}
                className={`flex ${
                  isSender ? "justify-end" : "justify-start"
                }`}
              >
                <div>
                  {msg.image ? (
                    <img
                      src={msg.image}
                      className="max-w-[200px]"
                    />
                  ) : (
                    <p className="bg-white/10 p-2 rounded">
                      {msg.text}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    {formatmessagetime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT */}
        <div className="flex items-center gap-3 p-3">

          <div className="flex-1 flex items-center px-4 py-2 rounded-full 
                          bg-white/5 backdrop-blur-md border border-gray-700">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
              placeholder="Send a message..."
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-400"
            />

            <input type="file" hidden id="img" onChange={handleNewImage} />

            <label htmlFor="img">
              <img
                src={assets.gallery_icon}
                className="w-5 cursor-pointer opacity-70 hover:opacity-100"
              />
            </label>
          </div>

          <button
            onClick={handleSendMessage}
            className="w-10 h-10 flex items-center justify-center rounded-full 
                       bg-gradient-to-r from-purple-500 to-violet-600"
          >
            <img src={assets.send_button} className="w-4" />
          </button>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden sm:block">
        <Chatbar isOpen={true} setIsOpen={setIsChatbarOpen} />
      </div>

      {/* MOBILE SIDEBAR */}
      <Chatbar
        isOpen={isChatbarOpen}
        setIsOpen={setIsChatbarOpen}
      />
    </div>
  );
};

export default Chat;