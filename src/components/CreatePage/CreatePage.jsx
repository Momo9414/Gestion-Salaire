import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Save,
  ArrowLeft,
  AlertCircle,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./CreatePage.css";

function CreatePage() {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // État initial du formulaire avec tous les champs du tableau Excel
  const [formData, setFormData] = useState({
    nom: "",
    prenoms: "",
    anneeNaissance: "",
    dateEmbauche: "",
    dateDepart: "",
    typeSalarie: "CDI", // Valeur par défaut
    dureeTravaillee: "",
    salaireBrut: "",
    brancheCotisee: "Générale", // Valeur par défaut
    mois: [{ id: 1, valeur: "" }], // État initial pour les mois
  });

  // Options pour les listes déroulantes
  const typesSalaries = ["Mensuel", "Journalier", "Horaire"];
  const branchesCotisees = [
    "Retraite",
    "Prestations Familiales et Assurance Maternite",
    "Accidents du Travail et Maladies Professionnelles",
    "Retraite & Prestations Familiales et Assurance Maternite",
    "Retraite & Accidents du Travail et Maladies Professionnelles",
    "Prestations Familiales et Assurance Maternite & Accidents du Travail et Maladies Professionnelles",
    "Retraite & Accidents du Travail et Maladies Professionnelles & Prestations Familiales et Assurance Maternite",
    "Autre",
  ];

  // Calcul automatique de la durée travaillée en mois basé sur les dates
  useEffect(() => {
    if (formData.dateEmbauche && formData.dateDepart) {
      const embaucheDate = new Date(formData.dateEmbauche);
      const departDate = new Date(formData.dateDepart);

      if (departDate >= embaucheDate) {
        const diffTime = departDate - embaucheDate;
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Approximation des mois

        setFormData((prev) => ({
          ...prev,
          dureeTravaillee: diffMonths.toString(),
        }));
      }
    }
  }, [formData.dateEmbauche, formData.dateDepart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Effacer l'erreur si l'utilisateur commence à corriger le champ
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  // Gestion des mois (ajouter, supprimer, modifier)
  const handleMoisChange = (id, value) => {
    const updatedMois = formData.mois.map((mois) =>
      mois.id === id ? { ...mois, valeur: value } : mois
    );

    setFormData({
      ...formData,
      mois: updatedMois,
    });
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ["nom", "prenoms", "salaireBrut"];

    // Vérifier les champs obligatoires
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        errors[field] = "Ce champ est obligatoire";
      }
    });

    // Validation du salaire brut (doit être un nombre positif)
    if (
      formData.salaireBrut &&
      !/^\d+(\.\d{1,2})?$/.test(formData.salaireBrut)
    ) {
      errors.salaireBrut = "Veuillez entrer un montant valide";
    }

    // Validation de l'année de naissance (entre 1900 et l'année actuelle)
    if (formData.anneeNaissance) {
      const currentYear = new Date().getFullYear();
      const yearValue = parseInt(formData.anneeNaissance, 10);
      if (isNaN(yearValue) || yearValue < 1900 || yearValue > currentYear) {
        errors.anneeNaissance = `L'année doit être entre 1900 et ${currentYear}`;
      }
    }

    // Validation de la date d'embauche
    if (formData.dateEmbauche && formData.dateDepart) {
      const embaucheDate = new Date(formData.dateEmbauche);
      const departDate = new Date(formData.dateDepart);

      if (departDate < embaucheDate) {
        errors.dateDepart =
          "La date de départ doit être postérieure à la date d'embauche";
      }
    }

    // Validation des mois (s'assurer qu'ils ne sont pas vides si présents)
    const moisAvecEreurs = formData.mois.filter(
      (mois) => mois.valeur && !/^(0?[1-9]|1[0-2])$/.test(mois.valeur)
    );

    if (moisAvecEreurs.length > 0) {
      errors.mois = "Les mois doivent être des nombres entre 1 et 12";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (validateForm()) {
      // Traitement du formulaire
      console.log("Données de l'employé:", formData);
      // En production, envoi à l'API ici

      // Afficher un message de succès
      alert("L'employé a été enregistré avec succès !");

      // Réinitialiser le formulaire ou rediriger l'utilisateur
      setFormData({
        nom: "",
        prenoms: "",
        anneeNaissance: "",
        dateEmbauche: "",
        dateDepart: "",
        typeSalarie: "CDI",
        dureeTravaillee: "",
        salaireBrut: "",
        brancheCotisee: "Générale",
        mois: [{ id: 1, valeur: "" }],
      });
      setFormSubmitted(false);
    } else {
      // Faire défiler jusqu'au premier champ avec erreur
      const firstErrorField = document.querySelector(".form-field.has-error");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="create-container">
      <div className="create-card">
        <div className="card-header">
          <h2 className="card-title">
            <UserPlus className="header-icon" size={24} />
            Inscription Manuelle d'un Employé
          </h2>
          <p className="card-subtitle">
            Remplissez le formulaire avec les informations de l'employé
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* NOM - Champ obligatoire */}
            <div className={`form-field ${formErrors.nom ? "has-error" : ""}`}>
              <label htmlFor="nom">
                Nom <span className="required-marker">*</span>
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={formErrors.nom ? "error-input" : ""}
              />
              {formErrors.nom && (
                <div className="error-text">
                  <AlertCircle size={16} />
                  {formErrors.nom}
                </div>
              )}
            </div>

            {/* PRENOMS - Champ obligatoire */}
            <div
              className={`form-field ${formErrors.prenoms ? "has-error" : ""}`}
            >
              <label htmlFor="prenoms">
                Prénoms <span className="required-marker">*</span>
              </label>
              <input
                type="text"
                id="prenoms"
                name="prenoms"
                value={formData.prenoms}
                onChange={handleChange}
                className={formErrors.prenoms ? "error-input" : ""}
              />
              {formErrors.prenoms && (
                <div className="error-text">
                  <AlertCircle size={16} />
                  {formErrors.prenoms}
                </div>
              )}
            </div>

            {/* ANNEE DE NAISSANCE */}
            <div
              className={`form-field ${
                formErrors.anneeNaissance ? "has-error" : ""
              }`}
            >
              <label htmlFor="anneeNaissance">Année de naissance</label>
              <input
                type="number"
                id="anneeNaissance"
                name="anneeNaissance"
                value={formData.anneeNaissance}
                onChange={handleChange}
                placeholder="AAAA"
                min="1900"
                max={new Date().getFullYear()}
                className={formErrors.anneeNaissance ? "error-input" : ""}
              />
              {formErrors.anneeNaissance && (
                <div className="error-text">
                  <AlertCircle size={16} />
                  {formErrors.anneeNaissance}
                </div>
              )}
            </div>

            {/* DATE D'EMBAUCHE */}
            <div
              className={`form-field ${
                formErrors.dateEmbauche ? "has-error" : ""
              }`}
            >
              <label htmlFor="dateEmbauche">Date d'embauche</label>
              <input
                type="date"
                id="dateEmbauche"
                name="dateEmbauche"
                value={formData.dateEmbauche}
                onChange={handleChange}
                className={formErrors.dateEmbauche ? "error-input" : ""}
              />
              {formErrors.dateEmbauche && (
                <div className="error-text">
                  <AlertCircle size={16} />
                  {formErrors.dateEmbauche}
                </div>
              )}
            </div>

            {/* DATE DE DEPART */}
            <div
              className={`form-field ${
                formErrors.dateDepart ? "has-error" : ""
              }`}
            >
              <label htmlFor="dateDepart">Date de départ</label>
              <input
                type="date"
                id="dateDepart"
                name="dateDepart"
                value={formData.dateDepart}
                onChange={handleChange}
                className={formErrors.dateDepart ? "error-input" : ""}
              />
              {formErrors.dateDepart && (
                <div className="error-text">
                  <AlertCircle size={16} />
                  {formErrors.dateDepart}
                </div>
              )}
            </div>

            {/* TYPE SALARIE */}
            <div
              className={`form-field ${
                formErrors.typeSalarie ? "has-error" : ""
              }`}
            >
              <label htmlFor="typeSalarie">Type de salarié</label>
              <select
                id="typeSalarie"
                name="typeSalarie"
                value={formData.typeSalarie}
                onChange={handleChange}
                className={formErrors.typeSalarie ? "error-input" : ""}
              >
                {typesSalaries.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {formErrors.typeSalarie && (
                <div className="error-text">
                  <AlertCircle size={16} />
                  {formErrors.typeSalarie}
                </div>
              )}
            </div>

            {/* DUREE TRAVAILLEE */}
            <div
              className={`form-field ${
                formErrors.dureeTravaillee ? "has-error" : ""
              }`}
            >
              <label htmlFor="dureeTravaillee">
                Durée travaillée (en mois)
              </label>
              <input
                type="number"
                id="dureeTravaillee"
                name="dureeTravaillee"
                value={formData.dureeTravaillee}
                onChange={handleChange}
                min="0"
                placeholder="Ex: 24"
                className={formErrors.dureeTravaillee ? "error-input" : ""}
              />
              {formErrors.dureeTravaillee && (
                <div className="error-text">
                  <AlertCircle size={16} />
                  {formErrors.dureeTravaillee}
                </div>
              )}
            </div>

            {/* SALAIRE BRUT - Champ obligatoire */}
            <div
              className={`form-field ${
                formErrors.salaireBrut ? "has-error" : ""
              }`}
            >
              <label htmlFor="salaireBrut">
                Salaire brut <span className="required-marker">*</span>
              </label>
              <div className="input-with-suffix">
                <input
                  type="text"
                  id="salaireBrut"
                  name="salaireBrut"
                  value={formData.salaireBrut}
                  onChange={handleChange}
                  placeholder="Ex: 2500.00"
                  className={formErrors.salaireBrut ? "error-input" : ""}
                />
                <span className="input-suffix">€</span>
              </div>
              {formErrors.salaireBrut && (
                <div className="error-text">
                  <AlertCircle size={16} />
                  {formErrors.salaireBrut}
                </div>
              )}
            </div>

            {/* BRANCHE COTISEE */}
            <div
              className={`form-field ${
                formErrors.brancheCotisee ? "has-error" : ""
              }`}
            >
              <label htmlFor="brancheCotisee">Branche cotisée</label>
              <select
                id="brancheCotisee"
                name="brancheCotisee"
                value={formData.brancheCotisee}
                onChange={handleChange}
                className={formErrors.brancheCotisee ? "error-input" : ""}
              >
                {branchesCotisees.map((branche) => (
                  <option key={branche} value={branche}>
                    {branche}
                  </option>
                ))}
              </select>
              {formErrors.brancheCotisee && (
                <div className="error-text">
                  <AlertCircle size={16} />
                  {formErrors.brancheCotisee}
                </div>
              )}
            </div>

            {/* MOIS TRAVAILLÉS - DYNAMIQUE */}
            <div
              className={`form-field form-field-full ${
                formErrors.mois ? "has-error" : ""
              }`}
            >
              <label>Mois travaillés</label>
              <div className="mois-container">
                {formData.mois.map((mois) => (
                  <div key={mois.id} className="mois-item">
                    <div className="mois-input-group">
                      <select
                        className={formErrors.mois ? "error-input" : ""}
                        value={mois.valeur}
                        onChange={(e) =>
                          handleMoisChange(mois.id, e.target.value)
                        }
                      >
                        <option value="">Sélectionner un mois</option>
                        <option value="1">Janvier</option>
                        <option value="2">Février</option>
                        <option value="3">Mars</option>
                        <option value="4">Avril</option>
                        <option value="5">Mai</option>
                        <option value="6">Juin</option>
                        <option value="7">Juillet</option>
                        <option value="8">Août</option>
                        <option value="9">Septembre</option>
                        <option value="10">Octobre</option>
                        <option value="11">Novembre</option>
                        <option value="12">Décembre</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
              {formErrors.mois && (
                <div className="error-text">
                  <AlertCircle size={16} />
                  {formErrors.mois}
                </div>
              )}
            </div>
          </div>

          <div className="form-notes">
            <p>
              <span className="required-marker">*</span> Champs obligatoires
            </p>
          </div>

          <div className="action-buttons">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              Retour
            </button>
            <button type="submit" className="btn-primary">
              <Save size={18} />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePage;
