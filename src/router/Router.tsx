import MainLayout from '@/layout/MainLayout';
import Home from '@/pages/home/Home';

const Router = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', exact: true, element: <Home /> },
    ],
  },
];

export default Router;