// src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Profilepage from './Pages/Profilepage';
import Loginpage from './Pages/Loginpage';
import { Toaster } from 'react-hot-toast';
import { Authcontext } from '../Context/Authcontext';

const App = () => {
  const { authuser } = useContext(Authcontext);

  return (
    <div className="min-h-screen">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authuser ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authuser ? <Loginpage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authuser ? <Profilepage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
