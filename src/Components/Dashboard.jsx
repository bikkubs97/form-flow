import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();


  const handleSignOut = () => {
  
    localStorage.removeItem('token');

    navigate('/');
  };

  return (
    <div >
      <div className='bg-blue-200 p-2'>
      <h1 className='text-center m-4 font-bold text-4xl'>Dashboard</h1>
      <nav className='text-center'>
        <Link className='m-5 text-2xl' to="create">Create Form</Link>
        <Link className="text-2xl" to="response">Response</Link>
        <button className="bg-blue-500 m-5 px-2 py-1 border rounded-md text-white hover:bg-yellow-400 hover:text-black" onClick={handleSignOut}>Sign Out</button>
      </nav>
      </div>
      <Outlet />
    </div>
  );
}
