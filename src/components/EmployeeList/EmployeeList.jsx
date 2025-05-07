import React, { useState, useEffect } from "react";
import {
  Users,
  FileSpreadsheet,
  FileText,
  UserPlus,
  Edit,
  Trash2,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./EmployeeList.css";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [selectedMonth, setSelectedMonth] = useState("Tous");
  const [showLegend, setShowLegend] = useState(false);
  const navigate = useNavigate();

  const moisLabels = [
    { value: "Tous", label: "Tous" },
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Août" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setEmployees([
        {
          id: 1,
          nom: "KOUASSI",
          prenoms: "Aya Marie",
          anneeNaissance: "1985",
          dateEmbauche: "2018-03-12",
          dateDepart: "",
          typeSalarie: "Horaire",
          dureeTravaillee: "36",
          salaireBrut: "350000",
          brancheCotisee: "23",
          moisTravailles: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        {
          id: 2,
          nom: "KOFFI",
          prenoms: "Paul",
          anneeNaissance: "1990",
          dateEmbauche: "2019-11-05",
          dateDepart: "",
          typeSalarie: "Mensuel",
          dureeTravaillee: "24",
          salaireBrut: "125000",
          brancheCotisee: "12",
          moisTravailles: [1, 2, 3, 4, 5, 6],
        },
        {
          id: 3,
          nom: "DIALLO",
          prenoms: "Ibrahim Moussa",
          anneeNaissance: "1982",
          dateEmbauche: "2015-07-22",
          dateDepart: "2023-01-10",
          typeSalarie: "Mensuel",
          dureeTravaillee: "90",
          salaireBrut: "470000",
          brancheCotisee: "123",
          moisTravailles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        {
          id: 4,
          nom: "TOURE",
          prenoms: "Sarah",
          anneeNaissance: "1995",
          dateEmbauche: "2021-04-18",
          dateDepart: "",
          typeSalarie: "Journalier",
          dureeTravaillee: "12",
          salaireBrut: "220000",
          brancheCotisee: "123",
          moisTravailles: [1, 3, 5, 7, 9, 11],
        },
        {
          id: 5,
          nom: "N'GUESSAN",
          prenoms: "Laurent",
          anneeNaissance: "1988",
          dateEmbauche: "2017-09-03",
          dateDepart: "",
          typeSalarie: "Mensuel",
          dureeTravaillee: "42",
          salaireBrut: "395000",
          brancheCotisee: "123",
          moisTravailles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
      ]);
    }, 500);
  }, []);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = React.useMemo(() => {
    let filtered = [...employees];

    // Appliquer le filtre par mois
    if (selectedMonth !== "Tous") {
      filtered = filtered.filter((emp) =>
        emp.moisTravailles.includes(Number(selectedMonth))
      );
    }

    // Tri
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    // Recherche
    return filtered.filter((emp) =>
      Object.values(emp).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [employees, sortConfig, searchTerm, selectedMonth]);

  const exportToExcel = () => {
    alert("Exportation XLSX en cours...");
  };

  const exportToPDF = () => {
    alert("Exportation PDF en cours...");
  };

  const formatSalaire = (salaire) => {
    return parseInt(salaire).toLocaleString("fr-FR") + " €";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getTypeSalarieBadgeClass = (type) => {
    switch (type) {
      case "Mensuel":
        return "type-m";
      case "Journalier":
        return "type-j";
      case "Horaire":
        return "type-h";
      default:
        return "type-other";
    }
  };

  const getBrancheCotiseeBadgeClass = (branche) => {
    switch (branche) {
      case "1":
        return "branche-1";
      case "2":
        return "branche-2";
      case "3":
        return "branche-3";
      case "12":
        return "branche-4";
      case "13":
        return "branche-5";
      case "23":
        return "branche-6";
      case "123":
        return "branche-7";
      default:
        return "branche-autre";
    }
  };

  const formatMoisTravailles = (moisArray) => {
    const nomsMois = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sept",
      "Oct",
      "Nov",
      "Déc",
    ];
    return moisArray
      .sort((a, b) => a - b)
      .map((mois) => nomsMois[mois - 1])
      .join(", ");
  };

  const handleAddEmployeeClick = () => {
    navigate("/import-excel");
  };

  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };

  // Détermine si la colonne "Mois Travaillés" doit être affichée
  const showMonthsColumn = selectedMonth === "Tous";

  // Obtenir le mois actuel au format texte (pour l'affichage dans le titre si un mois spécifique est sélectionné)
  const getCurrentMonthLabel = () => {
    if (selectedMonth === "Tous") return "";
    return (
      moisLabels.find((m) => m.value === parseInt(selectedMonth))?.label || ""
    );
  };

  return (
    <div className="employee-container">
      <div className="employee-card">
        <div className="card-header">
          <h2 className="card-title">
            <Users className="icon-green" size={24} />
            Liste des employés{" "}
            {selectedMonth !== "Tous" ? `- ${getCurrentMonthLabel()}` : ""}
          </h2>
          <div className="header-actions">
            <div className="export-buttons">
              <button onClick={exportToExcel} className="btn btn-excel">
                <FileSpreadsheet size={18} /> XLSX
              </button>
              <button onClick={exportToPDF} className="btn btn-pdf">
                <FileText size={18} /> PDF
              </button>
            </div>
            <button onClick={handleAddEmployeeClick} className="btn btn-add">
              <UserPlus size={18} /> Ajouter un employé
            </button>
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="filter-month">
            <label>Mois:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="month-select"
            >
              {moisLabels.map((mois) => (
                <option key={mois.value} value={mois.value}>
                  {mois.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th
                  onClick={() => requestSort("nom")}
                  className={
                    sortConfig.key === "nom"
                      ? `sort-${sortConfig.direction}`
                      : ""
                  }
                >
                  Nom
                </th>
                <th
                  onClick={() => requestSort("prenoms")}
                  className={
                    sortConfig.key === "prenoms"
                      ? `sort-${sortConfig.direction}`
                      : ""
                  }
                >
                  Prénoms
                </th>
                <th
                  onClick={() => requestSort("anneeNaissance")}
                  className={
                    sortConfig.key === "anneeNaissance"
                      ? `sort-${sortConfig.direction}`
                      : ""
                  }
                >
                  Année Naiss.
                </th>
                <th
                  onClick={() => requestSort("typeSalarie")}
                  className={
                    sortConfig.key === "typeSalarie"
                      ? `sort-${sortConfig.direction}`
                      : ""
                  }
                >
                  Type Salarié
                </th>
                <th
                  onClick={() => requestSort("salaireBrut")}
                  className={
                    sortConfig.key === "salaireBrut"
                      ? `sort-${sortConfig.direction}`
                      : ""
                  }
                >
                  Salaire Brut
                </th>
                <th
                  onClick={() => requestSort("brancheCotisee")}
                  className={
                    sortConfig.key === "brancheCotisee"
                      ? `sort-${sortConfig.direction}`
                      : ""
                  }
                >
                  Branche Cotisée
                </th>
                {showMonthsColumn && <th>Mois Travaillés</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEmployees.length > 0 ? (
                sortedEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.nom}</td>
                    <td>{emp.prenoms}</td>
                    <td>{emp.anneeNaissance}</td>
                    <td>
                      <span
                        className={`badge ${getTypeSalarieBadgeClass(
                          emp.typeSalarie
                        )}`}
                      >
                        {emp.typeSalarie}
                      </span>
                    </td>
                    <td>{formatSalaire(emp.salaireBrut)}</td>
                    <td>
                      <span
                        className={`badge ${getBrancheCotiseeBadgeClass(
                          emp.brancheCotisee
                        )}`}
                      >
                        {emp.brancheCotisee}
                      </span>
                    </td>
                    {showMonthsColumn && (
                      <td className="mois-cell">
                        {formatMoisTravailles(emp.moisTravailles)}
                      </td>
                    )}
                    <td className="actions-cell">
                      <button className="btn-icon btn-edit" title="Modifier">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon btn-delete" title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={showMonthsColumn ? "8" : "7"}
                    className="table-empty"
                  >
                    {employees.length === 0 ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      "Aucun employé trouvé"
                    )}
                  </td>
                </tr>
              )}

              <div className="legend-btn">
              <button onClick={toggleLegend} className="btn btn-legend">
                <Info size={18} /> Légende
              </button>

              </div>
              {showLegend && (
                <div className="legend-container">
                  <div className="legend-section">
                    <h3>Types de salariés</h3>
                    <div className="legend-items">
                      <div className="legend-item">
                        <span className="badge type-m">Mensuel</span>
                        <span className="legend-text">
                          Rémunération au mois
                        </span>
                      </div>
                      <div className="legend-item">
                        <span className="badge type-j">Journalier</span>
                        <span className="legend-text">
                          Rémunération à la journée
                        </span>
                      </div>
                      <div className="legend-item">
                        <span className="badge type-h">Horaire</span>
                        <span className="legend-text">
                          Rémunération à l'heure
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="legend-section">
                    <h3>Branches cotisées</h3>
                    <div className="legend-items">
                      <div className="legend-item">
                        <span className="badge branche-1">1</span>
                        <span className="legend-text">Retraite</span>
                      </div>
                      <div className="legend-item">
                        <span className="badge branche-2">2</span>
                        <span className="legend-text">
                          Accidents du Travail et Maladies Professionnelles
                        </span>
                      </div>
                      <div className="legend-item">
                        <span className="badge branche-3">3</span>
                        <span className="legend-text">
                          Prestations Familiales et Assurance Maternité
                        </span>
                      </div>
                      <div className="legend-item">
                        <span className="badge branche-4">12</span>
                        <span className="legend-text">
                          Retraite + Accidents du Travail
                        </span>
                      </div>
                      <div className="legend-item">
                        <span className="badge branche-5">13</span>
                        <span className="legend-text">
                          Retraite + Prestations Familiales
                        </span>
                      </div>
                      <div className="legend-item">
                        <span className="badge branche-6">23</span>
                        <span className="legend-text">
                          Accidents du Travail + Prestations Familiales
                        </span>
                      </div>
                      <div className="legend-item">
                        <span className="badge branche-7">123</span>
                        <span className="legend-text">Toutes les branches</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
