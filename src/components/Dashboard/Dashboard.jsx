import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import {
  Search,
  Bell,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  User,
  BarChart2,
  PieChart,
  Calendar,
} from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
  const [notifications, setNotifications] = useState(3);
  const [employeeStats, setEmployeeStats] = useState({
    total: 125,
    active: 118,
    mensuel: 78,
    horaire: 29,
    journalier: 18,
    avgSalary: 385750,
    turnoverRate: 5.2
  });
  
  const location = useLocation();

  // Données pour les graphiques
  const salaryDistribution = [
    { range: '< 150k €', count: 23 },
    { range: '150k-250k €', count: 42 },
    { range: '250k-350k €', count: 31 },
    { range: '350k-450k €', count: 17 },
    { range: '> 450k €', count: 12 }
  ];

  const employeesByBranche = [
    { branche: '1 - Retraite', count: 29 },
    { branche: '2 - AT/MP', count: 15 },
    { branche: '3 - PF/AM', count: 12 },
    { branche: '12', count: 16 },
    { branche: '13', count: 10 },
    { branche: '23', count: 18 },
    { branche: '123', count: 25 }
  ];

  // Calculer le montant total des salaires
  const totalSalaryAmount = employeeStats.avgSalary * employeeStats.total / 1000;
  
  // Contenu par défaut du tableau de bord
  const defaultDashboardContent = (
    <>
      <div className="dashboard-header-section">
        <h1 className="page-title">Tableau de bord RH</h1>
        <div className="dashboard-period-selector">
          <select className="period-select">
            <option value="month">Mai 2025</option>
            <option value="quarter">T2 2025</option>
            <option value="year">Année 2025</option>
          </select>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-details">
            <h3>Effectif total</h3>
            <p className="stat-value">{employeeStats.total}</p>
            <div className="stat-subinfo">
              <span className="active-indicator">{employeeStats.active} actifs</span>
              <span className="stat-trend positive">+3% ce mois</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-details">
            <h3>Masse salariale</h3>
            <p className="stat-value">{totalSalaryAmount.toLocaleString('fr-FR')} k€</p>
            <p className="stat-trend">Mensuelle</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-details">
            <h3>Salaire moyen</h3>
            <p className="stat-value">{(employeeStats.avgSalary).toLocaleString('fr-FR')} €</p>
            <p className="stat-trend positive">+2.5% cette année</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-details">
            <h3>Taux rotation</h3>
            <p className="stat-value">{employeeStats.turnoverRate}%</p>
            <p className="stat-trend negative">+0.8% vs 2024</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-charts-row">
        <div className="chart-container">
          <h2 className="chart-title">
            <PieChart size={18} /> Répartition par type de contrat
          </h2>
          <div className="chart-placeholder pie-chart">
            <div className="contract-type-distribution">
              <div className="contract-type-item">
                <span className="color-box mensuel"></span>
                <span className="contract-label">Mensuel</span>
                <span className="contract-count">{employeeStats.mensuel}</span>
                <span className="contract-percentage">{((employeeStats.mensuel/employeeStats.total)*100).toFixed(1)}%</span>
              </div>
              <div className="contract-type-item">
                <span className="color-box horaire"></span>
                <span className="contract-label">Horaire</span>
                <span className="contract-count">{employeeStats.horaire}</span>
                <span className="contract-percentage">{((employeeStats.horaire/employeeStats.total)*100).toFixed(1)}%</span>
              </div>
              <div className="contract-type-item">
                <span className="color-box journalier"></span>
                <span className="contract-label">Journalier</span>
                <span className="contract-count">{employeeStats.journalier}</span>
                <span className="contract-percentage">{((employeeStats.journalier/employeeStats.total)*100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="chart-container">
          <h2 className="chart-title">
            <BarChart2 size={18} /> Distribution des salaires
          </h2>
          <div className="chart-placeholder bar-chart">
            {salaryDistribution.map((item, index) => (
              <div className="bar-item" key={index}>
                <div className="bar-label">{item.range}</div>
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{width: `${(item.count/employeeStats.total)*100}%`}}
                  ></div>
                  <span className="bar-value">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-bottom-row">
        <div className="widget recent-activity">
          <h2>Activité récente</h2>
          <ul className="activity-list">
            <li>
              <div className="activity-icon update">
                <Users size={18} />
              </div>
              <div className="activity-details">
                <p className="activity-text">
                  Marie Martin a mis à jour son profil
                </p>
                <p className="activity-time">Il y a 2 heures</p>
              </div>
            </li>
            <li>
              <div className="activity-icon new">
                <Users size={18} />
              </div>
              <div className="activity-details">
                <p className="activity-text">Nouveau salarié : Thomas Dubois</p>
                <p className="activity-time">Hier, 14:30</p>
              </div>
            </li>
            <li>
              <div className="activity-icon alert">
                <AlertCircle size={18} />
              </div>
              <div className="activity-details">
                <p className="activity-text">
                  5 déclarations de cotisations à soumettre
                </p>
                <p className="activity-time">Date limite : 15 mai</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="widget branch-distribution">
          <h2>Répartition par branche cotisée</h2>
          <div className="branch-chart">
            {employeesByBranche.map((item, index) => (
              <div className="branch-item" key={index}>
                <div className="branch-label">{item.branche}</div>
                <div className="branch-bar-container">
                  <div 
                    className={`branch-bar branch-${index+1}`}
                    style={{width: `${(item.count/employeeStats.total)*100}%`}}
                  ></div>
                  <span className="branch-value">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // Vérifier si on est sur une route enfant
  const isChildRouteActive =
    location.pathname.includes("import-excel") ||
    location.pathname.includes("employee-list") ||
    location.pathname.includes("create-page");

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <div className="search-container-dashboard">
            <span className="search-icon">
              <Search size={18} />
            </span>
            <input type="text" placeholder="Rechercher..." />
          </div>
          <div className="header-actions">
            <div className="notification-icon">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
            </div>
            <div className="user-profile">
              <User size={20} />
              <div className="user-info">
                <span className="user-name">Jean Dupont</span>
                <span className="user-role">Administrateur</span>
              </div>
            </div>
          </div>
        </header>

        <div className="content">
          {/* Afficher le contenu enfant si une route enfant est active, sinon afficher le contenu par défaut */}
          {isChildRouteActive ? <Outlet /> : defaultDashboardContent}
        </div>
      </div>
    </div>
  );
}