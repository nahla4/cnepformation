'use client';
import { useState, useEffect } from 'react';

export default function ModifierInfosCandidat() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    numero_telephone: '',
    date_naissance: '',
    adresse: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Récupérer l'id du candidat depuis le localStorage
  const candidatId = typeof window !== 'undefined' ? localStorage.getItem('candidatId') : null;

  // Charger les infos réelles au chargement de la page
  useEffect(() => {
    if (candidatId) {
      fetch(`http://localhost:3000/api/candidats/${candidatId}`)
        .then(res => res.json())
        .then(data => setFormData({
          nom: data.nom || '',
          prenom: data.prenom || '',
          email: data.email || '',
          numero_telephone: data.numero_telephone || '',
          date_naissance: data.date_naissance ? data.date_naissance.substring(0, 10) : '', // yyyy-mm-dd
          adresse: data.adresse || '',
        }))
        .catch(() => setError("Erreur lors du chargement des infos"));
    }
  }, [candidatId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    if (!candidatId) {
      setError("Candidat non identifié.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/candidats/${candidatId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur inconnue.");
        setLoading(false);
        return;
      }

      setSuccess("Informations mises à jour avec succès !");
    } catch (err) {
      setError("Erreur lors de la connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#c1121f]/10 flex justify-center items-center px-4 py-10">
      <form onSubmit={handleSubmit} className="bg-white max-w-xl w-full p-10 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-[#c1121f] mb-6 text-center">Modifier mes informations</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-600 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] text-gray-900" required />
          <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-600 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] text-gray-900" required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-600 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] text-gray-900" required />
          <input type="text" name="numero_telephone" placeholder="Téléphone" value={formData.numero_telephone} onChange={handleChange} className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-600 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] text-gray-900" />
          <input type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} className="border border-gray-300 rounded-md px-4 py-3 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] col-span-1 sm:col-span-2 text-gray-900" />
          <textarea name="adresse" placeholder="Adresse" value={formData.adresse} onChange={handleChange} className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-600 text-sm shadow-sm focus:outline-none focus:border-[#c1121f] col-span-1 sm:col-span-2 text-gray-900" rows={2} />
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-4">{success}</p>}
        <button type="submit" className="mt-8 w-full bg-[#c1121f] hover:bg-[#a30d18] text-white font-semibold py-3 rounded-md text-lg transition" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
