'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ConnexionCandidat() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/candidats/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          mot_de_passe: formData.password, // clé attendue côté backend
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la connexion.");
        setLoading(false);
        return;
      }

      // Connexion réussie
      // Tu peux stocker l'id du candidat pour session / dashboard
      localStorage.setItem('candidatId', data.candidat.id);

      // Redirection vers le dashboard avec un petit délai, le temps d'afficher succès
      setTimeout(() => {
        window.location.href = '/candidats/dashboard';
      }, 500);

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
        className="bg-white max-w-md w-full p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-[#c1121f] mb-6 text-center">
          Connexion Candidat
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-600 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] text-gray-900"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-600 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] text-gray-900"
            required
          />

          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}

          <button
            type="submit"
            className="bg-[#c1121f] hover:bg-[#a30d18] text-white font-bold py-3 rounded mt-2 text-lg transition"
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Vous n'avez pas de compte ?{' '}
            <Link href="/candidats/inscription" className="text-[#c1121f] font-semibold hover:underline">
              Créez-en un ici
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
