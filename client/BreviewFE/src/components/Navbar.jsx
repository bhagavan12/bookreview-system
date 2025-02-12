// // src/components/Navbar.js
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   return (
//     <nav className="navbar">
//       <ul>
//         <li><Link to="/home">Home</Link></li>
//         <li><Link to="/community">Community</Link></li>
//         <li><Link to="/search-upload">Search & Upload</Link></li>
//         <li><Link to="/profile">Profile</Link></li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/user/userSlice';
import { Menu } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const user = useSelector((state) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">
            <h1>YourBrand</h1>
          </Link>
          <button className="menu-toggle" onClick={toggleMenu}>
            <Menu size={24} />
          </button>
        </div>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/search-upload">Search & Review</Link></li>
            {user ? (
              <>
                <li><Link to="/profile">Profile</Link></li>
                <li>
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li><Link to="/login" className="login-button">Login</Link></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;