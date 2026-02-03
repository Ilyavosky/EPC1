import React from 'react';
import Sidebar from '../components/sideBar';
import Header from '../components/header';
import Dashboard from '../components/dashboard';

const Home = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <Dashboard />
      </div>
    </div>
  );
};

export default Home;