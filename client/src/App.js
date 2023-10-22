import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import PageRender from './PageRender';
import LoginScreen from './pages/login';

function App() {
  return (
    <div className="App">
      <h1>Client</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginScreen />}/> 
          <Route path="/:page" element={<PageRender />}/> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
