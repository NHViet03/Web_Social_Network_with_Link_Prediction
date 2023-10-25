import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import PageRender from './PageRender';
import LoginScreen from './pages/login';

function App() {
  return (
    <div className="App">
      <div className='main'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginScreen />}/> 
            <Route path="/:page" element={<PageRender />}/> 
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
