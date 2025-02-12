// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import ProtectedRoute from "./ProtectedRoute";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import Home from "./pages/HomePage";
// import Navbar from "./components/Navbar";

// const App = () => {
//   const { user } = useSelector((state) => state.user); // Access user state from Redux
//   const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Fetch userInfo from localStorage
//   const isAuthenticated = !!(user?.token || userInfo?.token); // Check if authenticated via Redux or localStorage

//   return (
//     <Router>
//       {isAuthenticated && <Navbar />} {/* Show Navbar if authenticated */}
//       <div className="app-container">
//         <Routes>
//           {/* Public Routes */}
//           <Route
//             path="/register"
//             element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />}
//           />
//           <Route
//             path="/login"
//             element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
//           />

//           {/* Protected Routes */}
//           <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
//           {/* Add more protected routes as needed */}
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import CommunityPage from './pages/CommunityPage';
import SearchAndUploadPage from './pages/SearchAndUploadPage';
import Register from './pages/Register';
import SignInUp from './pages/Login';
import ProtectedRoute from './ProtectedRoute';
import BookDetails from './components/BookDetails';

const App = () => {
  const { user } = useSelector((state) => state.user);
  const isAuthenticated = !!user;

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <SignInUp />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />} />
        <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        <Route path="/community" element={<ProtectedRoute element={<CommunityPage />} />} />
        <Route path="/search-upload" element={<ProtectedRoute element={<SearchAndUploadPage />} />} />
        <Route path="/book-details/:bookId" element={<ProtectedRoute element={<BookDetails />} />} />
        {/* <Route path='/bookdetails' */}
      </Routes>
    </Router>
  );
};

export default App;
