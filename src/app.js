import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // นำเข้า AuthProvider
import Dashboard from './component/dashboard';
import AddEmployee from './component/add';
import EmployeeLogin from './component/Login';
import ManageAds from './component/manageadd';
import ManageUsers from './component/manageuser';
import ManagePosts from './component/managepost';
import ManageReportedPosts from './component/ManageReports';
import ManageCategories from './component/ManageCategories';

function App() {
  return (
    <Router>
      <AuthProvider> {/* ใช้ AuthProvider เพื่อให้ทุกหน้าสามารถเข้าถึง handleLogout ได้ */}
        <Routes>
          <Route path="/" element={<EmployeeLogin />} />
          <Route path="/add" element={<AddEmployee />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<EmployeeLogin />} />
          <Route path='/manageuser' element={<ManageUsers />} />
          <Route path='/manageadd' element={<ManageAds />} />
          <Route path='/managepost' element={<ManagePosts />} />     
          <Route path="/manage-reported-posts" element={<ManageReportedPosts />} />
          <Route path="/managecategories" element={<ManageCategories/>}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
