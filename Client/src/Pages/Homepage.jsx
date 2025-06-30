import React, { useContext } from "react";
import Rightbar from "../Components/Rightbar";
import Chat from "../Components/Chat";
import Chatbar from "../Components/Chatbar";
import { Chatcontext } from "../../Context/Chatcontext";

function Homepage() {
  const { selectedUser } = useContext(Chatcontext);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      <div
        className={`backdrop-blur-xl border border-gray-600 rounded-2xl w-[95%] h-[95%] overflow-hidden text-white
          grid relative transition-all duration-300
          ${
            selectedUser
              ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
              : "md:grid-cols-[1fr_2fr]"
          }
        `}
      >
        {/* Left Sidebar */}
        <Rightbar />

        {/* Center Chat Area */}
        <Chat />

        {/* Right Chatbar */}
        {selectedUser && <Chatbar />}
      </div>
    </div>
  );
}

export default Homepage;
