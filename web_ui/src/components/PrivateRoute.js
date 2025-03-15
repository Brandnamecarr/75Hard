import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If there is no user, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children; // If user is authenticated, render the child components
};

export default PrivateRoute;
