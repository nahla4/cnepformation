'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ModifierFormationPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    duree_en_jours: '',
    date_debut: '',
    date_fin: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Chargement initial (fetch actuel)
  useEffect(() => {
    fetch(`http://localhost:3000/api/formations/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          titre: data.titre || '',
          description: data.description || '',
          duree_en_jours: data.duree_en_jours ? String(data.duree_en_jours) : '',
          date_debut: data.date_debut ? data.date_debut.substring(0, 10) : '',
          date_fin: data.date_fin ? data.date_fin.substring(0, 10) : '',
        });
      })
      .catch(() => setError("Erreur lors du chargement."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`http://localhost:3000/api/formations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur inconnue.");
        return;
      }
      setSuccess('Formation modifiée avec succès !');
    } catch {
      setError("Erreur lors de la modification.");
    }
  };

  if (loading) return <div className="p-12 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#c1121f]/10 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-lg w-full p-10 rounded-2xl shadow-xl"
      >
        <h1 className="text-2xl font-bold text-[#c1121f] mb-6 text-center">Modifier la formation</h1>

        <input
          type="text"
          name="titre"
          placeholder="Titre de la formation"
          value={formData.titre}
          onChange={handleChange}
          className="mb-4 w-full border px-4 py-3 rounded text-sm text-gray-900 placeholder-gray-900 shadow-sm"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="mb-4 w-full border px-4 py-3 rounded text-sm text-gray-900 placeholder-gray-900 shadow-sm"
          rows={3}
        />

        <input
          type="number"
          name="duree_en_jours"
          placeholder="Durée en jours"
          min={1}
          value={formData.duree_en_jours}
          onChange={handleChange}
          className="mb-4 w-full border px-4 py-3 rounded text-sm text-gray-900 placeholder-gray-900 shadow-sm"
          required
        />

        <input
          type="date"
          name="date_debut"
          placeholder="Date de début"
          value={formData.date_debut}
          onChange={handleChange}
          className="mb-4 w-full border px-4 py-3 rounded text-sm text-gray-900 shadow-sm"
          required
        />

        <input
          type="date"
          name="date_fin"
          placeholder="Date de fin"
          value={formData.date_fin}
          onChange={handleChange}
          className="mb-4 w-full border px-4 py-3 rounded text-sm text-gray-900 shadow-sm"
          required
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        <button
          type="submit"
          className="w-full bg-[#c1121f] hover:bg-[#a30d18] text-white py-3 rounded font-semibold transition"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
