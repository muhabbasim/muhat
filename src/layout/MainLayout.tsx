import Footer from '@/_components/footer/Footer';
import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <main className='relative bg-imgx w-fullx bg-[#ffffff]x'>
      <div>
        <Outlet />
      </div>
      <div className='fixed bottom-0 left-0 w-full'>
        <Footer />
      </div>
    </main>
  );
};

export default MainLayout;