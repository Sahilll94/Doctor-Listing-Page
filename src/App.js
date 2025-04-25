import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import DoctorListingPage from './pages/DoctorListingPage';

function App() {
  return (
    <BrowserRouter>
      <DoctorListingPage />
    </BrowserRouter>
  );
}

export default App;
