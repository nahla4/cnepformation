'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ConnexionFormateur() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/formateurs/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          mot_de_passe: formData.password, // la clé attendue côté backend
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la connexion.");
        setLoading(false);
        return;
      }

      // Stocker l'id formateur en session
      localStorage.setItem('formateurId', data.formateur.id);

      // Redirection dashboard après une courte pause
      setTimeout(() => {
        window.location.href = '/formateurs/dashboard';
      }, 300);
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
        <h1 className="text-2xl font-bold text-[#c1121f] mb-6 text-center">Connexion Formateur</h1>
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
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          className="mb-2 w-full border border-gray-300 rounded px-4 py-3 placeholder-gray-600 text-sm shadow-sm text-gray-900"
          required
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full mt-4 bg-[#c1121f] hover:bg-[#a30d18] text-white font-semibold py-3 rounded"
          disabled={loading}
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>
        <p className="text-sm text-center text-gray-600 mt-4">
          Vous n'avez pas de compte ?{" "}
          <Link href="/formateurs/inscription" className="text-[#c1121f] font-semibold hover:underline">
            Inscrivez-vous ici
          </Link>
        </p>
      </form>
    </div>
  );
}
