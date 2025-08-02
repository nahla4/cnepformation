'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DescriptionFormation() {
  const { id } = useParams();
  const [formation, setFormation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/formations/${id}`)
      .then(res => res.json())
      .then(data => setFormation(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-12 text-center">Chargement...</div>;
  if (!formation) return <div className="p-12 text-red-600 text-center">Formation introuvable.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#c1121f]/10 px-4 py-10">
      <div className="bg-white max-w-2xl w-full p-10 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-[#c1121f] mb-4">{formation.titre}</h1>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Date de début :</span>{' '}
          <span className="text-gray-900">{formation.date_debut?.substring(0,10)}</span>
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Date de fin :</span>{' '}
          <span className="text-gray-900">{formation.date_fin?.substring(0,10)}</span>
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Durée :</span>{' '}
          <span className="text-gray-900">{formation.duree_en_jours} jours</span>
        </p>
        <p className="text-gray-800 mt-6">{formation.description}</p>
        <button
          className="mt-8 bg-blue-900 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
          onClick={() => window.location.href = `/formateurs/formation/${id}/candidats`}
        >
          Voir les candidats inscrits
        </button>
      </div>
    </div>
  );
}
