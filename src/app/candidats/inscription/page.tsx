'use client';

import { useState } from 'react';

// Utils
function isAlphabetic(str: string) {
  return /^[A-Za-zÀ-ÿ\s\-']+$/.test(str);
}
function isValidPhone(phone: string) {
  // Algerian: starts with 05, 06 or 07, then 8 digits
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

export default function InscriptionCandidat() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    numero_telephone: '',
    date_naissance: '',
    adresse: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Champs alphabetic
    if (!isAlphabetic(formData.nom)) {
      setError('Le nom doit être alphabétique.');
      return;
    }
    if (!isAlphabetic(formData.prenom)) {
      setError('Le prénom doit être alphabétique.');
      return;
    }
    // 2. Phone
    if (!isValidPhone(formData.numero_telephone)) {
      setError('Le numéro doit commencer par 05, 06 ou 07 et contenir 10 chiffres au total.');
      return;
    }
    // 3. Date de naissance - over 22
    if (!formData.date_naissance) {
      setError("Veuillez fournir votre date de naissance.");
      return;
    }
    if (!isOver22(formData.date_naissance)) {
      setError('Vous devez avoir au moins 22 ans pour vous inscrire.');
      return;
    }
    // 4. Password
    if (!isValidPassword(formData.password)) {
      setError(
        'Le mot de passe doit contenir au moins 9 caractères, une MAJUSCULE, un chiffre et un caractère spécial.'
      );
      return;
    }
    // 5. Password match
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);

    const payload = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      numero_telephone: formData.numero_telephone,
      date_naissance: formData.date_naissance,
      adresse: formData.adresse,
      mot_de_passe: formData.password, // Backend expects this
    };

    try {
      const res = await fetch('http://localhost:3000/api/candidats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Erreur lors de l'inscription");
        setLoading(false);
        return;
      }

      setSuccess(data.message || "Inscription réussie !");
      // Success: redirect after 2s
      setTimeout(() => {
        window.location.href = '/candidats/connexion';
      }, 2000);
    } catch (err) {
      setError("Erreur lors de la connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#c1121f]/10 flex justify-center items-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-2xl w-full p-10 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-[#c1121f] mb-8 text-center">
          Créer un compte Candidat
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-900 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] text-gray-900"
            required
          />
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-600 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] text-gray-900"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-600 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] text-gray-900"
            required
          />
          <input
            type="text"
            name="numero_telephone"
            placeholder="Téléphone"
            value={formData.numero_telephone}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-600 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] text-gray-900"
            required
          />
          <div className="sm:col-span-2 flex flex-col">
            <label htmlFor="date_naissance" className="mb-1 text-gray-700 font-medium">
              Date de naissance
            </label>
            <input
              type="date"
              name="date_naissance"
              id="date_naissance"
              value={formData.date_naissance}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-3 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] text-gray-900"
              required
            />
          </div>
          <textarea
            name="adresse"
            placeholder="Adresse"
            value={formData.adresse}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-600 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] col-span-1 sm:col-span-2 text-gray-900"
            rows={2}
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe*"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-600 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] text-gray-900"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmation du mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-600 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] text-gray-900"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-4">{success}</p>}
        <button
          type="submit"
          className="mt-8 w-full bg-[#c1121f] hover:bg-[#a30d18] text-white font-semibold py-3 rounded-md text-lg transition"
          disabled={loading}
        >
          {loading ? "Envoi en cours..." : "S’inscrire"}
        </button>
      </form>
    </div>
  );
}
