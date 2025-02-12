// // src/pages/Login.js
// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser } from '../features/user/userSlice';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const dispatch = useDispatch();
//     const { loading, error } = useSelector((state) => state.user);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         dispatch(loginUser({ email, password }));
//     };

//     return (
//         <div className="login-page">
//             <h1>Login</h1>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <button type="submit" disabled={loading}>Login</button>
//             </form>
//             {error && <p className="error">{error}</p>}
//         </div>
//     );
// };

// export default Login;


import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice"; // Login action
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch login action
    dispatch(loginUser({ email, password })).then((result) => {
      if (result.payload?.token) {
        navigate("/home"); // Redirect on successful login
      }
    });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error.message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
