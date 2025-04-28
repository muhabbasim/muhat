import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <main className='w-full bg-[#ffffff]'>
      <div>
        <Outlet />
      </div>
    </main>
  );
};

export default MainLayout;