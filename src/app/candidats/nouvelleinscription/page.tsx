'use client';

import { useEffect, useState } from 'react';

export default function FormationsCandidat() {
  const [selectedDomaine, setSelectedDomaine] = useState('Tous');
  const [formations, setFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const candidatId = typeof window !== "undefined" ? localStorage.getItem('candidatId') : null;

  useEffect(() => {
    fetch('http://localhost:3000/api/formations')
      .then(res => res.json())
      .then(data => setFormations(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const domainesUniques = Array.from(
    new Set(
      formations
        .map(f => f.domaine && f.domaine.trim().toLowerCase())
        .filter(Boolean)
    )
  );
  const domaines = ['Tous', ...domainesUniques];

  const filteredFormations =
    selectedDomaine === 'Tous'
      ? formations
      : formations.filter(
          (f) =>
            f.domaine && f.domaine.trim().toLowerCase() === selectedDomaine
        );

  const handleInscription = async (formationId: number) => {
    setMessage('');
    setError('');
    if (!candidatId) {
      setError("Vous devez être connecté en tant que candidat.");
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/inscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidat_id: candidatId,
          formation_id: formationId
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Gère le cas déjà inscrit (code 409)
        if (res.status === 409) {
          setError(data.error || "Vous êtes déjà inscrit à cette formation.");
        } else {
          setError(data.error || "Erreur lors de l'inscription.");
        }
        return;
      }
      setMessage("Inscription réussie !");
    } catch (err) {
      setError("Erreur serveur.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2f2f2] to-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#c1121f] mb-8 text-center">
          Formations disponibles
        </h1>

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
              {domaine === 'Tous'
                ? 'Tous'
                : domaine.charAt(0).toUpperCase() + domaine.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormations.map((formation) => (
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
                  {formation.domaine}
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
                  {formation.date_debut?.substring(0,10)}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Date de fin :{' '}
                <span className="font-semibold text-gray-900">
                  {formation.date_fin?.substring(0,10)}
                </span>
              </p>
              <button
                className="mt-4 bg-blue-900 hover:bg-blue-700 text-white px-4 py-2 rounded transition w-full mb-2"
                onClick={() => window.location.href = `/candidats/formation/${formation.id}`}
              >
                Voir la description
              </button>
              <button
                className="bg-[#c1121f] hover:bg-[#a30d18] text-white px-4 py-2 rounded transition w-full"
                onClick={() => handleInscription(formation.id)}
              >
                M’inscrire à cette formation
              </button>
            </div>
          ))}
        </div>

        {loading && (
          <p className="text-center text-gray-600 mt-10">Chargement des formations...</p>
        )}
        {!loading && filteredFormations.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Aucune formation disponible dans ce domaine.
          </p>
        )}
        {message && (
          <p className="text-center text-green-600 mt-10 font-bold">{message}</p>
        )}
        {error && (
          <p className="text-center text-red-600 mt-10 font-bold">{error}</p>
        )}
      </div>
    </div>
  );
}
