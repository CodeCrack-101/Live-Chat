import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { Authcontext } from '../../Context/Authcontext';
import { Navigate } from 'react-router-dom';
const Loginpage = () => {
  const [currentState, setCurrentState] = useState('Sign up');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isBioStage, setIsBioStage] = useState(false);

  const { login, authuser } = useContext(Authcontext);
  const navigate = useNavigate();

  // ✅ Redirect to home page after successful login/signup
  useEffect(() => {
    console.log("🚀 authuser changed in Loginpage", authuser); // ✅ Add this
    if (authuser) {
      Navigate("/");
    }
  }, [authuser, navigate]);
  

const handleInitialSubmit = async (e) => {
  e.preventDefault();

  if (!agreed && currentState === 'Sign up') {
    alert('Please agree to the terms before proceeding.');
    return;
  }

  if (currentState === 'Sign up') {
    setIsBioStage(true);
  } else {
    const res = await login('login', { email, password });

    // ✅ force redirect here if login successful
    if (res === true) {
      navigate('/');
    }
  }
};

const handleFinalSubmit = async (e) => {
  e.preventDefault();
  const res = await login('signup', { fullname, email, password, bio });

  // ✅ force redirect here if signup successful
  if (res === true) {
    navigate('/');
  }
};

  return (
    <div
      className="min-h-screen w-screen bg-cover bg-center flex items-center justify-center px-6 py-10"
      style={{
        backgroundImage: `url(${assets.bg_blur})`,
        backgroundColor: 'black',
      }}
    >
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center text-white w-1/2 max-md:hidden">
        <img src={assets.logo_big} alt="QuickChat Logo" className="w-32 mb-6" />
        <h1 className="text-5xl font-bold tracking-wide">QuickChat</h1>
      </div>

      {/* Form Section */}
      <form
        onSubmit={isBioStage ? handleFinalSubmit : handleInitialSubmit}
        className="bg-black/70 text-white border border-gray-700 rounded-xl p-8 w-full max-w-md backdrop-blur-md shadow-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {currentState === 'Sign up'
              ? isBioStage
                ? 'Complete Profile'
                : 'Sign Up'
              : 'Login'}
          </h2>
          <img
            src={assets.arrow_icon}
            className="w-5 cursor-pointer rotate-180"
            onClick={() => {
              setIsBioStage(false);
              setCurrentState((prev) => (prev === 'Sign up' ? 'Login' : 'Sign up'));
            }}
            alt="Switch"
          />
        </div>

        {/* Form Fields */}
        {!isBioStage ? (
          <>
            {currentState === 'Sign up' && (
              <input
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="bg-transparent border border-gray-600 w-full p-3 rounded-md text-sm mb-4 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border border-gray-600 w-full p-3 rounded-md text-sm mb-4 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border border-gray-600 w-full p-3 rounded-md text-sm mb-4 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500"
              required
            />

            {currentState === 'Sign up' && (
              <div className="flex items-start gap-2 text-sm text-gray-400 mb-4">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="mt-1 accent-violet-500"
                />
                <p>Agree to the terms of use & privacy policy.</p>
              </div>
            )}
          </>
        ) : (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Write a short bio about yourself..."
            className="bg-transparent border border-gray-600 w-full p-3 rounded-md text-sm mb-6 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-md font-medium mb-4"
        >
          {isBioStage ? 'Finish Signup' : currentState === 'Sign up' ? 'Next' : 'Login Now'}
        </button>

        {/* Toggle Login/Signup */}
        {!isBioStage && (
          <div className="flex flex-col gap-2">
            {currentState === 'Sign up' ? (
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <span
                  className="font-medium text-violet-500 cursor-pointer"
                  onClick={() => {
                    setCurrentState('Login');
                    setIsBioStage(false);
                  }}
                >
                  Login here
                </span>
              </p>
            ) : (
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <span
                  className="font-medium text-violet-500 cursor-pointer"
                  onClick={() => {
                    setCurrentState('Sign up');
                    setIsBioStage(false);
                  }}
                >
                  Create one
                </span>
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Loginpage;
