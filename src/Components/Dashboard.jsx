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
      <div className='bg-indigo-500 p-2 text-white  w-full'>
      <h1 className='text-center m-4 font-bold text-4xl'>Dashboard</h1>
      <nav className='text-center'>      
        <Link className='m-5 text-2xl hover:text-yellow-200' to="create">Create</Link>      
        <Link className="text-2xl  hover:text-yellow-200" to="response">Responses</Link>
        <Link className='m-5 text-2xl  hover:text-yellow-200' to="myforms">My Forms</Link>
        <button className="bg-blue-500 m-5 px-2 py-1 border rounded-md text-white hover:bg-yellow-400 hover:text-black" onClick={handleSignOut}>Sign Out</button>
      </nav>
      </div>
      <Outlet />
    </div>
  );
}
