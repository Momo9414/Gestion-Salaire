import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/LoginPage/LoginPage";
import ImportExcel from "./components/ImportExcel/ImportExcel";
import EmployeeList from "./components/EmployeeList/EmployeeList";
import CreatePage from "./components/CreatePage/CreatePage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          <Route path="*" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        ) : (
          <Route path="/" element={<Dashboard />}>
            <Route path="import-excel" element={<ImportExcel />} />
            <Route path="employee-list" element={<EmployeeList />} />
            <Route path="/create-page" element={<CreatePage />} />
            {/* autres routes... */}
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;
