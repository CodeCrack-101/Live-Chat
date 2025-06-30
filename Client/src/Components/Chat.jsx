import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { formatmessagetime } from "../Library/util";
import { Chatcontext } from "../../Context/Chatcontext";
import { Authcontext } from "../../Context/Authcontext";
import toast from "react-hot-toast";

const Chat = () => {
  const { messages, selectedUser, setselectedUser, sendMessage, getMessages } = useContext(Chatcontext);
  const { authuser, onlineuser } = useContext(Authcontext);

  const [input, setinput] = useState("");

  const isOnline = onlineuser.map(String).includes(selectedUser?._id?.toString());

  const handlesendmessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    try {
      await sendMessage({
        text: input.trim(),
        receiverId: selectedUser._id,
      });
      setinput("");
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleNewimage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await sendMessage({
          image: reader.result,
          receiverId: selectedUser._id,
        });
        e.target.value = "";
      } catch (err) {
        toast.error("Failed to send image");
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  return selectedUser ? (
    <div className="h-full overflow-hidden relative backdrop-blur-lg px-4 py-3 flex flex-col">
      <div className="flex items-center justify-between border-b border-stone-500 pb-3">
        <div className="flex items-center gap-3">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt={selectedUser?.fullName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-white font-medium">{selectedUser?.fullName}</p>
            {isOnline ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></span>
                <span className="text-xs text-green-400">Online</span>
              </>
            ) : (
              <span className="text-xs text-gray-400">Offline</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <img
            src={assets.arrow_icon}
            alt="Back"
            className="md:hidden w-5 cursor-pointer"
            onClick={() => setselectedUser(null)}
          />
          <img
            src={assets.help_icon}
            alt="Help"
            className="hidden md:block w-5 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 py-4 pr-2 hide-scrollbar">
        {messages.map((msg, index) => {
          const isSender = msg?.senderId?.toString() === authuser?._id?.toString();
          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${isSender ? "justify-end" : "justify-start"}`}
            >
              {!isSender && (
                <img
                  src={selectedUser?.profilePic || assets.avatar_icon}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full"
                />
              )}
              <div>
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="Attachment"
                    className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                  />
                ) : (
                  <p
                    className={`p-3 rounded-lg text-sm break-words max-w-[250px] ${
                      isSender
                        ? "bg-violet-500/70 text-white rounded-br-none"
                        : "bg-white/10 text-white rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </p>
                )}
                <p className="text-[10px] text-gray-400 mt-1 text-right">
                  {formatmessagetime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full border border-gray-600">
          <input
            type="text"
            onChange={(e) => setinput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handlesendmessage(e) : null)}
            placeholder="Send a message..."
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none bg-transparent text-white placeholder-gray-400"
          />
          <input onChange={handleNewimage} type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="Gallery"
              className="w-5 h-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handlesendmessage}
          src={assets.send_button}
          alt="Send"
          className="w-7 h-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="h-full w-full flex flex-col items-center justify-center bg-transparent text-white">
      <img
        src={assets.logo_icon || "https://via.placeholder.com/80"}
        alt="Logo"
        className="w-20 mb-4 opacity-90"
      />
      <p className="text-lg font-medium text-center">Chat anytime, anywhere</p>
    </div>
  );
};

export default Chat;
