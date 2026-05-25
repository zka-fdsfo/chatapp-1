import React from 'react'
import { useState, createContext, useEffect } from "react";
import { useAuth } from '../hook/hookauth';
import { Navigate } from "react-router-dom";
const Provider = ({ children }) => {
  const { user, loading , authReady} = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="text-white text-xl">Loading...</div>
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