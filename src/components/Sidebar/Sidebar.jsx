import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Users, DollarSign, BarChart2, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Accueil");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Accueil", icon: <Home size={20} />, path: "/" },
    { name: "Employés", icon: <Users size={20} />, path: "/employee-list" },
    { name: "Salaires", icon: <DollarSign size={20} />, path: "/import-excel" },
    { name: "Statistiques", icon: <BarChart2 size={20} />, path: "/stats" },
    { name: "Paramètres", icon: <Settings size={20} />, path: "/parametres" }
  ];

  const handleNavigation = (item) => {
    setActiveItem(item.name);
    navigate(item.path);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">HR</div>
          <h1>HR Manager</h1>
        </div>
        <button className="collapse-btn" onClick={toggleSidebar}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li 
              key={item.name}
              className={activeItem === item.name ? "active" : ""}
              onClick={() => handleNavigation(item)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
              {item.name === "Employés" && (
                <span className="menu-badge">8</span>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="help-section">
          <div className="help-icon">
            <HelpCircle size={18} />
          </div>
          <div className="help-text">
            <p>Besoin d'aide?</p>
            <a href="#">Centre d'assistance</a>
          </div>
        </div>
        
        <div className="logout">
          <span className="logout-icon">
            <LogOut size={18} />
          </span>
          <span className="menu-text">Déconnexion</span>
        </div>
      </div>
    </div>
  );
}