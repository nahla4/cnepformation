'use client';
import { useState } from 'react';

// Domaines proposés pour la banque
const DOMAINES_BANQUE = [
  'Informatique Bancaire',
  'Sécurité Informatique',
  'Finance et Comptabilité',
  'Audit Bancaire',
  'Droit Bancaire',
  'Marketing et Communication Financière',
  'Gestion des Risques',
  'Produits Bancaires',
  'Gestion des Ressources Humaines',
  'Gestion de Projet'
];

// Fonctions de validation utilisées chez candidat
function isAlphabetic(str: string) {
  return /^[A-Za-zÀ-ÿ\s\-']+$/.test(str);
}
function isValidPhone(phone: string) {
  return /^(05|06|07)[0-9]{8}$/.test(phone);
}
function isValidPassword(password: string) {
  return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{9,}$/.test(password);
}
function isOver22(dateNaissance: string) {
  if (!dateNaissance) return false;
  const dob = new Date(dateNaissance);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  const day = today.getDate() - dob.getDate();
  return (
    age > 22 ||
    (age === 22 && (m > 0 || (m === 0 && day >= 0)))
  );
}

export default function InscriptionFormateur() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    numero_telephone: '',
    domaine: '',
    date_naissance: '',
    adresse: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Gestion du changement d'input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!isAlphabetic(formData.nom)) {
      setError('Le nom doit être alphabétique.');
      return;
    }
    if (!isAlphabetic(formData.prenom)) {
      setError('Le prénom doit être alphabétique.');
      return;
    }
    if (!isValidPhone(formData.numero_telephone)) {
      setError('Le numéro doit commencer par 05, 06 ou 07 et contenir 10 chiffres au total.');
      return;
    }
    if (!formData.date_naissance) {
      setError('Veuillez fournir votre date de naissance.');
      return;
    }
    if (!isOver22(formData.date_naissance)) {
      setError('Vous devez avoir au moins 22 ans pour vous inscrire.');
      return;
    }
    if (!formData.domaine) {
      setError('Veuillez choisir un domaine.');
      return;
    }
    if (!isValidPassword(formData.password)) {
      setError('Le mot de passe doit contenir au moins 9 caractères, une MAJUSCULE, un chiffre et un caractère spécial.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    const payload = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      numero_telephone: formData.numero_telephone,
      domaine: formData.domaine,
      date_naissance: formData.date_naissance,
      adresse: formData.adresse,
      mot_de_passe: formData.password,
    };

    try {
      const res = await fetch('http://localhost:3000/api/formateurs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription.");
        setLoading(false);
        return;
      }

      setSuccess("Inscription réussie !");
      setTimeout(() => {
        window.location.href = '/formateurs/connexion';
      }, 2000);

    } catch (err) {
      setError("Erreur lors de la connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f2f2f2] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-md w-full p-10 rounded-xl shadow"
      >
        <h1 className="text-2xl font-bold text-[#c1121f] mb-6 text-center">
          Inscription Formateur
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            className="mb-4 w-full border border-gray-300 rounded px-4 py-3 placeholder-gray-600 text-sm shadow-sm text-gray-900"
            required
          />
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            className="mb-4 w-full border border-gray-300 rounded px-4 py-3 placeholder-gray-600 text-sm shadow-sm text-gray-900"
            required
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4 w-full border border-gray-300 rounded px-4 py-3 placeholder-gray-600 text-sm shadow-sm text-gray-900"
          required
        />
        <input
          type="text"
          name="numero_telephone"
          placeholder="Téléphone"
          value={formData.numero_telephone}
          onChange={handleChange}
          className="mb-4 w-full border border-gray-300 rounded px-4 py-3 placeholder-gray-600 text-sm shadow-sm text-gray-900"
          required
        />

        {/* Domaine sélectionné dans une liste */}
        <div className="mb-4">
          <label htmlFor="domaine" className="block mb-2 font-medium text-gray-900">Domaine</label>
          <select
            id="domaine"
            name="domaine"
            value={formData.domaine}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded px-4 py-3 text-sm shadow-sm text-gray-900 bg-white"
            required
          >
            <option value="">-- Veuillez choisir --</option>
            {DOMAINES_BANQUE.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="date_naissance" className="mb-1 text-gray-700 font-medium">
            Date de naissance 
          </label>
          <input
            type="date"
            name="date_naissance"
            id="date_naissance"
            value={formData.date_naissance}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded px-4 py-3 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] text-gray-900"
            required
          />
        </div>
        <textarea
          name="adresse"
          placeholder="Adresse"
          value={formData.adresse}
          onChange={handleChange}
          className="mb-4 w-full border border-gray-300 rounded px-4 py-3 placeholder-gray-600 text-sm shadow-sm text-gray-900"
          rows={2}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          className="mb-4 w-full border border-gray-300 rounded px-4 py-3 placeholder-gray-600 text-sm shadow-sm text-gray-900"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmez le mot de passe"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-3 placeholder-gray-600 text-sm shadow-sm text-gray-900"
          required
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
        <button
          type="submit"
          className="mt-6 w-full bg-[#c1121f] hover:bg-[#a30d18] text-white font-semibold py-3 rounded transition"
          disabled={loading}
        >
          {loading ? "Envoi..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}
