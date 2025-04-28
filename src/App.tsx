import React from 'react';
import { useRoutes } from 'react-router-dom';
import Router from './router/Router';

const App: React.FC = () => {

  const routing = useRoutes(Router);
  
  return (
    <div>
      {routing}
    </div>
  );
};

export default App;