import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { Authcontext } from '../../Context/Authcontext';

const Profilepage = () => {
  const { authuser, updateProfile } = useContext(Authcontext);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const [name, setName] = useState(authuser?.fullname || '');
  const [bio, setBio] = useState(authuser?.bio || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { fullname: name, bio };

    if (selectedImage) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        payload.profilePic = reader.result;
        await updateProfile(payload);
        navigate('/');
      };
    } else {
      await updateProfile(payload);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10" style={{ backgroundImage: `url(${assets.bg_blur})`, backgroundColor: 'black' }}>
      <div className="w-full max-w-2xl bg-black/50 border border-gray-600 text-white rounded-xl flex items-center justify-between gap-8 max-sm:flex-col-reverse p-6 md:p-10 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 w-full">
          <h3 className="text-lg font-semibold">Profile Details</h3>
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden onChange={(e) => setSelectedImage(e.target.files[0])} />
            <img src={selectedImage ? URL.createObjectURL(selectedImage) : authuser?.profilePic || assets.avatar_icon} alt="Profile" className="w-12 h-12 object-cover rounded-full" />
            <span>Upload Profile Image</span>
          </label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="bg-transparent border border-gray-500 rounded-md p-2 outline-none focus:ring-2 focus:ring-violet-500" />
          <textarea required rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Write your profile bio..." className="bg-transparent border border-gray-500 rounded-md p-2 outline-none focus:ring-2 focus:ring-violet-500" />
          <button type="submit" className="bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-full py-2 px-6 font-medium hover:opacity-90 transition">Save</button>
        </form>
        <img className="w-32 h-32 object-contain max-sm:mt-6" src={assets.logo_icon} alt="Logo" />
      </div>
    </div>
  );
};

export default Profilepage;
