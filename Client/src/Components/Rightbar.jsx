import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "../../Context/Authcontext";
import { Chatcontext } from "../../Context/Chatcontext";

const Rightbar = () => {
  const [input, setInput] = useState("");
  const [openMenu, setOpenMenu] = useState(false); // ✅ NEW

  const navigate = useNavigate();

  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setunseenmessages,
  } = useContext(Chatcontext);

  const { logout, onlineuser } = useContext(Authcontext);

  useEffect(() => {
    getUsers();
  }, [onlineuser]);

  const filteredUsers = input.trim()
    ? users?.filter((user) =>
        user?.fullname?.toLowerCase().includes(input.trim().toLowerCase())
      )
    : users || [];

  return (
    <div
      className={`bg-[#8185B2]/10 h-full overflow-hidden p-5 text-white relative ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="QuickChat" className="max-w-32" />

          {/* ✅ FIXED MENU */}
          <div className="relative">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="w-6 h-6 cursor-pointer"
              onClick={() => setOpenMenu((prev) => !prev)}
            />

            {openMenu && (
              <div className="absolute top-full right-0 z-20 w-32 mt-2 p-3 rounded-md bg-[#282142] border border-gray-600 text-sm text-white">
                <p
                  onClick={() => {
                    navigate("/profile");
                    setOpenMenu(false);
                  }}
                  className="cursor-pointer hover:text-gray-300"
                >
                  Edit Profile
                </p>

                <hr className="my-2 border-gray-600" />

                <p
                  onClick={() => {
                    logout();
                    navigate("/login");
                    setOpenMenu(false);
                  }}
                  className="cursor-pointer hover:text-gray-300"
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} className="w-3" alt="Search" />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      {/* USERS */}
      <div className="mt-4 flex flex-col gap-2 overflow-y-auto max-h-[70vh] pr-1">
        {filteredUsers.map((user) => {
          const isOnline = onlineuser
            .map(String)
            .includes(user._id?.toString());

          return (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setunseenmessages((prev) => ({
                  ...prev,
                  [user._id]: 0,
                }));
              }}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm transition-all ${
                selectedUser?._id === user._id
                  ? "bg-[#282142]/50"
                  : ""
              }`}
            >
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt="User"
                className="w-[35px] aspect-[1/1] rounded-full"
              />

              <div className="flex flex-col leading-5">
                <p>{user.fullname}</p>
                <span
                  className={`text-xs ${
                    isOnline ? "text-green-400" : "text-neutral-400"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>

              {unseenMessages[user._id] > 0 && (
                <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                  {unseenMessages[user._id]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rightbar;