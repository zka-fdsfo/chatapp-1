import React from 'react'
import { useState, createContext, useEffect } from "react";
import { useAuth } from '../hook/hookauth';
import { Navigate } from "react-router-dom";
import AppSkeleton from '../components/AppSkeleton.jsx';
const Provider = ({ children }) => {
  const { user, loading, authReady } = useAuth();

  if (loading) {
    return (
      <div className="h-full  bg-zinc-950 p-2">
     <AppSkeleton /> 
     </div>
    );
  }

  // 2. ONLY redirect AFTER loading is false
  if (!loading && !user && !authReady) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      {children}
    </div>
  )
}

export default Provider