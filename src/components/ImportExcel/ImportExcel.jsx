import React, { useState } from "react";
import { FileText, Upload, File, AlertCircle, CheckCircle, X, UserPlus } from "lucide-react";
import * as XLSX from "xlsx";
import "./ImportExcel.css";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


export default function ImportExcel() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sheetData, setSheetData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [isValidData, setIsValidData] = useState(false);
  const navigate = useNavigate();

  // Liste des champs obligatoires
  const requiredFields = ["NOM", "PRENOMS", "SALAIRE BRUT"];
  
  // Liste complète des champs attendus
  const expectedFields = [
    "DATE DE DEPART", 
    "NOM", 
    "PRENOMS", 
    "ANNEE DE NAISSANCE", 
    "DATE D'EMBAUCHE", 
    "DATE DE DEPART", 
    "TYPE SALARIE", 
    "DUREE TRAVAILLEE", 
    "SALAIRE BRUT", 
    "BRANCHE COTISEE"
  ];

  const validateHeaders = (headers) => {
    // Vérifier que tous les champs obligatoires sont présents
    const missingFields = requiredFields.filter(field => 
      !headers.some(header => header.toUpperCase() === field)
    );
    
    if (missingFields.length > 0) {
      setErrorMessage(`Champs obligatoires manquants: ${missingFields.join(", ")}`);
      setIsValidData(false);
      return false;
    }
    
    setIsValidData(true);
    return true;
  };

  const processExcelFile = async (file) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Convertir le contenu en JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        setErrorMessage("Le fichier est vide ou ne contient pas de données valides");
        return;
      }
      
      // La première ligne contient les en-têtes
      const headerRow = jsonData[0].map(header => String(header).trim());
      setHeaders(headerRow);
      
      // Vérifier les en-têtes obligatoires
      const isValid = validateHeaders(headerRow);
      
      if (isValid) {
        // Conserver uniquement les données (sans les en-têtes)
        const dataRows = jsonData.slice(1);
        setSheetData(dataRows);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Erreur lors du traitement du fichier Excel:", error);
      setErrorMessage("Erreur lors de la lecture du fichier. Vérifiez le format.");
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    // Réinitialiser les messages d'erreur et les données
    setErrorMessage("");
    setSheetData(null);
    setHeaders([]);
    setIsValidData(false);
    
    if (!selectedFile) return;
    
    // Vérifier l'extension du fichier
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = selectedFile.name.substr(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setErrorMessage("Format invalide. Veuillez sélectionner un fichier Excel (.xls ou .xlsx)");
      return;
    }
    
    // Vérifier la taille (limiter à 10MB par exemple)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage("Le fichier est trop volumineux (max: 10MB)");
      return;
    }
    
    setFile(selectedFile);
    processExcelFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !isValidData) return;
    
    // TODO: envoyer les données à l'API Node.js
    console.log("Import des données :", sheetData);
    
    // Simuler une soumission réussie
    alert(`Le fichier "${file.name}" a été importé avec succès avec ${sheetData.length} enregistrements.`);
  };

  // Gestion du drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const renderDataTable = () => {
    if (!sheetData || headers.length === 0) return null;
    
    return (
      <div className="data-preview-container">
        <h3 className="preview-title">
          <CheckCircle size={18} className="success-icon" />
          Aperçu des données ({sheetData.length} enregistrements)
        </h3>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className={requiredFields.includes(header) ? "required-column" : ""}>
                    {header} {requiredFields.includes(header) && <span className="required-marker">*</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheetData.slice(0, 5).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((_, colIndex) => (
                    <td key={colIndex}>{row[colIndex] !== undefined ? row[colIndex] : ""}</td>
                  ))}
                </tr>
              ))}
              {sheetData.length > 5 && (
                <tr className="more-rows">
                  <td colSpan={headers.length}>
                    + {sheetData.length - 5} autres lignes non affichées
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="import-container">
      <div className="import-card">
        <div className="card-header">
          <h2 className="card-title">
            <FileText className="header-icon" size={24} />
            Importer un fichier Excel
          </h2>
          <p className="card-subtitle">
            Importez votre liste d'employés au format Excel (.xls ou .xlsx)
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className={`upload-area ${isDragging ? "dragging" : ""} ${
              file ? "has-file" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              id="excel-file"
              type="file"
              accept=".xls,.xlsx"
              onChange={handleChange}
              className="file-input"
            />

            <div className="upload-content">
              {file ? (
                <div className="file-preview">
                  <File size={36} className="file-icon" />
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setSheetData(null);
                      setHeaders([]);
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={38} className="upload-icon" />
                  <div className="upload-text">
                    <span className="upload-instruction">
                      Déposez votre fichier ici
                    </span>
                    <span className="upload-sub">ou</span>
                    <span className="browse-button">
                      Parcourir les fichiers
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="error-message">
              <AlertCircle size={16} />
              {errorMessage}
            </div>
          )}

          {isValidData && sheetData && renderDataTable()}

          <div className="action-buttons">
            <button
              type="submit"
              className="btn-primary"
              disabled={!isValidData}
            >
              {isValidData
                ? "Importer maintenant"
                : "Sélectionnez un fichier valide"}
            </button>
            {/* <button
              type="submit"
              className="btn-primary"
              onClick={() => navigate("/create-page")}
            >
              Inscription Manuelle
            </button> */}
            <Link to="/create-page" className="btn-primary">
              <UserPlus size={18} />
              Inscription Manuelle
            </Link>
          </div>

          <div className="import-notes">
            <p>
              <strong>Note:</strong> Les formats acceptés sont .xls et .xlsx
              uniquement
            </p>
            <p>Taille maximale: 10MB</p>
            <p>
              Les champs marqués d'un <span className="required-marker">*</span>{" "}
              sont obligatoires:
              {requiredFields.map((field, index) => (
                <span key={index} className="required-field">
                  {field}
                </span>
              ))}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}