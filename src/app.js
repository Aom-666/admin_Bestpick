import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './component/dashboard';
import AddEmployee from './component/add';
import EmployeeLogin from './component/Login';
import ManageAds from './component/manageadd';
import ManageUsers from './component/manageuser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeLogin />} />
        <Route path="/add" element={<AddEmployee />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<EmployeeLogin />} />
        <Route path='/manageuser' element={<ManageUsers />} />
        <Route path='/manageadd' element={<ManageAds/>} />
      </Routes>
    </Router>
  );
}

export default App;
