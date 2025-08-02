'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FormationDetailPage() {
  const { id } = useParams();
  const [formation, setFormation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/formations/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object' && !Array.isArray(data) && data.titre) {
          setFormation(data);
        } else {
          setFormation(null);
        }
      })
      .catch(() => setFormation(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-gray-600 font-bold text-xl">
        Chargement...
      </div>
    );

  if (!formation) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-red-600 font-bold text-xl">
        Formation non trouvée ❌
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2f2f2] via-white to-[#fff] px-4 py-14 flex justify-center">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-[#c1121f] mb-4">
          {formation.titre}
        </h1>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Domaine : </strong>
          <span className="text-gray-900">{formation.domaine || '-'}</span>
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Durée : </strong>
          <span className="text-gray-900">{formation.duree_en_jours} jours</span>
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Date de début : </strong>
          <span className="text-gray-900">{formation.date_debut?.substring(0,10)}</span>
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <strong>Date de fin : </strong>
          <span className="text-gray-900">{formation.date_fin?.substring(0,10)}</span>
        </p>
        <hr className="my-4" />
        <p className="text-gray-800 leading-relaxed">{formation.description}</p>
        <button
          className="mt-8 w-full bg-[#c1121f] hover:bg-[#a30d18] text-white font-semibold py-3 rounded-lg transition"
          onClick={() => window.location.href = '/candidats/connexion'}
        >
          S’inscrire à cette formation
        </button>
      </div>
    </div>
  );
}
