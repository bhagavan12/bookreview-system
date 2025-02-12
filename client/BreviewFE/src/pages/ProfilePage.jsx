import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../features/user/userSlice';
import { getBooksByUser } from '../features/books/booksSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  
  // Get user and books data from Redux store
  const { user, loading: userLoading, error: userError } = useSelector((state) => state.user);
  const { profilebooks, loading: booksLoading, error: booksError } = useSelector((state) => state.books);

  // Get user ID from localStorage
  const userId = user?._id || JSON.parse(localStorage.getItem('user'))?._id;
    console.log("userId",userId);
  useEffect(() => {
    if (userId) {
      dispatch(getUserProfile()); // Fetch user details
      dispatch(getBooksByUser(userId)); // Fetch books created by the user
    }
  }, [dispatch, userId]);

  if (userLoading || booksLoading) return <div>Loading...</div>;
  if (userError || booksError) return <div>Error: {userError || booksError}</div>;

  return (
    <div>
      <h2>User Profile</h2>
      {user && (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      
      <h3>Books Created by {user?.name}</h3>
      {profilebooks && profilebooks.length > 0 ? (
        <ul>
          {profilebooks.map((book) => (
            <li key={book._id}>{book.title}</li>
          ))}
        </ul>
      ) : (
        <p>No books created yet.</p>
      )}
    </div>
  );
};

export default ProfilePage;
