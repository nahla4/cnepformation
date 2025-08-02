'use client';

import { useEffect, useState } from 'react';

export default function FormationsDisponibles() {
  const [selectedDomaine, setSelectedDomaine] = useState('Tous');
  const [formations, setFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetcher toutes les formations depuis le backend
  useEffect(() => {
    fetch('http://localhost:3000/api/formations')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erreur côté serveur: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setFormations(data);
          setError(null);
        } else {
          setFormations([]);
          setError('Erreur: Retour inattendu du backend');
        }
      })
      .catch(err => {
        setFormations([]);
        setError("Impossible de joindre le serveur ou route API introuvable.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Extraire les domaines distincts à partir des résultats réels
  const domaines = [
    'Tous',
    ...Array.from(
      new Set(
        (Array.isArray(formations)
          ? formations.map((f) => f.domaine).filter(Boolean)
          : [])
      )
    ),
  ];

  // Filtrer selon la sélection du domaine
  const filteredFormations =
    selectedDomaine === 'Tous'
      ? (Array.isArray(formations) ? formations : [])
      : (Array.isArray(formations)
          ? formations.filter((f) => f.domaine === selectedDomaine)
          : []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2f2f2] to-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#c1121f] mb-8 text-center">
          Formations disponibles
        </h1>
        {/* Filtrage par domaine */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {domaines.map((domaine, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDomaine(domaine)}
              className={`px-5 py-2 rounded-full border font-medium transition ${
                selectedDomaine === domaine
                  ? 'bg-[#c1121f] text-white'
                  : 'bg-white text-[#c1121f] border-[#c1121f] hover:bg-[#c1121f] hover:text-white'
              }`}
            >
              {domaine}
            </button>
          ))}
        </div>
        {/* Liste des formations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormations.map((formation: any) => (
            <div
              key={formation.id}
              className="bg-white border shadow-sm rounded-2xl p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {formation.titre}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                Domaine :{' '}
                <span className="font-semibold text-gray-900">
                  {formation.domaine || '-'}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Durée :{' '}
                <span className="font-semibold text-gray-900">
                  {formation.duree_en_jours} jours
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Date de début :{' '}
                <span className="font-semibold text-gray-900">
                  {formation.date_debut?.substring(0, 10)}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Date de fin :{' '}
                <span className="font-semibold text-gray-900">
                  {formation.date_fin?.substring(0, 10)}
                </span>
              </p>
              <button
                className="mt-4 bg-[#c1121f] hover:bg-[#a30d18] text-white px-4 py-2 rounded transition w-full"
                onClick={() =>
                  window.location.href = `/formations/${formation.id}`
                }
              >
                Voir la formation
              </button>
            </div>
          ))}
        </div>
        {loading && (
          <p className="text-center text-gray-600 mt-10">Chargement des formations...</p>
        )}
        {!loading && error && (
          <p className="text-center text-red-600 mt-10">{error}</p>
        )}
        {!loading && !error && filteredFormations.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Aucune formation disponible dans ce domaine.
          </p>
        )}
      </div>
    </div>
  );
}
