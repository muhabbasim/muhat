import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from "@/_components/footer/footer";

const MainLayout: React.FC = () => {
  return (
    <main className=' bg-img w-full bg-[#ffffff]'>
      <div>
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default MainLayout;