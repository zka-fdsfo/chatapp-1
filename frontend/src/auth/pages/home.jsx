import React from 'react'
import { useAuth } from '../hook/hookauth';
const home = () => {
  const { user } = useAuth();
  return (
    <div>home
      <h1>Welcome, {user ? user.email : "Guest"}!</h1>
    </div>
  )
}

export default home