'use client';

import { useEffect, useState } from 'react';

export default function CandidatDashboard() {
  const [candidat, setCandidat] = useState<any>(null);
  const [formations, setFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const candidatId =
    typeof window !== "undefined" ? localStorage.getItem('candidatId') : null;

  // Utilitaire: test si on peut annuler (avant début)
  const isAnnulable = (dateDebut?: string) => {
    if (!dateDebut) return false;
    const now = new Date();
    const debut = new Date(dateDebut);
    return debut > now;
  };

  // Utilitaire: test si formation terminée
  const isTerminee = (dateFin?: string) => {
    if (!dateFin) return false;
    const now = new Date();
    const fin = new Date(dateFin);
    return now > fin;
  };

  useEffect(() => {
    if (!candidatId) {
      setLoading(false);
      return;
    }
    // Charger données candidat
    fetch(`http://localhost:3000/api/candidats/${candidatId}`)
      .then(res => res.json())
      .then(data => setCandidat(data));

    // Charger formations inscrites au candidat avec jointure domaines
    fetch(`http://localhost:3000/api/candidats/${candidatId}/formations`)
      .then(res => res.json())
      .then(data =>
        setFormations(
          Array.isArray(data)
            ? data.filter(f => !isTerminee(f.date_fin)) // filtrage formations non terminées
            : []
        )
      )
      .finally(() => setLoading(false));
  }, [candidatId]);

  const handleAnnulerInscription = async (formationId: number, dateDebut: string) => {
    setMessage('');
    setError('');
    if (!candidatId) {
      setError("Vous devez être connecté.");
      return;
    }
    if (!isAnnulable(dateDebut)) {
      setError("Vous ne pouvez plus annuler une formation déjà commencée.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/api/inscriptions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidat_id: candidatId, formation_id: formationId }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de l'annulation.");
        return;
      }
      setMessage('Inscription annulée.');
      setFormations(formations => formations.filter(f => f.id !== formationId));
    } catch {
      setError('Erreur serveur.');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!candidat)
    return <div className="text-red-700 text-lg p-8">Candidat non trouvé ou non connecté.</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#c1121f]/10 flex flex-col">
      {/* Header */}
      <header className="w-full px-8 py-6 flex flex-col sm:flex-row justify-between items-center bg-[#1a1a1a] shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
          Bonjour,{' '}
          <span className="text-[#c1121f]">
            {candidat.prenom} {candidat.nom}
          </span>
        </h1>
        <button
          className="mt-4 sm:mt-0 bg-[#c1121f] hover:bg-[#a30d18] text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          onClick={() => {
            localStorage.removeItem('candidatId');
            window.location.href = '/candidats/connexion';
          }}
        >
          Déconnexion
        </button>
      </header>

      {/* Infos et formations */}
      <main className="flex-1 flex flex-col lg:flex-row gap-8 p-8 w-full max-w-7xl mx-auto">
        {/* Infos perso */}
        <section className="flex-1 bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col justify-between min-w-[320px]">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Mes informations</h2>
            <div className="space-y-3 text-gray-800">
              <div>
                <span className="font-semibold">Email :</span> {candidat.email}
              </div>
              <div>
                <span className="font-semibold">Téléphone :</span> {candidat.numero_telephone}
              </div>
              <div>
                <span className="font-semibold">Date de naissance :</span> {candidat.date_naissance}
              </div>
              <div>
                <span className="font-semibold">Adresse :</span> {candidat.adresse}
              </div>
            </div>
          </div>
          <button
            className="mt-4 bg-white border border-[#c1121f] text-[#c1121f] hover:bg-[#c1121f] hover:text-white font-semibold px-5 py-2 rounded-lg transition shadow"
            onClick={() => window.location.href = '/candidats/modifier'}
          >
            Modifier mes informations
          </button>
        </section>

        {/* Formations inscrites */}
        <section className="flex-[2] bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Mes formations</h2>
            <button
              className="mt-6 bg-[#c1121f] hover:bg-[#a30d18] text-white font-semibold px-6 py-2 rounded transition"
              onClick={() => window.location.href = '/candidats/nouvelleinscription'}
            >
              S’inscrire à une nouvelle formation
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {formations.length === 0 ? (
              <p className="text-gray-600">Aucune formation pour le moment.</p>
            ) : (
              <div className="grid gap-4">
                {formations.map((f) => {
                  const annulable = isAnnulable(f.date_debut);
                  return (
                    <div
                      key={f.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-[#f2f2f2] via-white to-[#f2f2f2] rounded-xl p-5 shadow hover:shadow-lg transition"
                    >
                      <div>
                        <span className="font-semibold text-lg text-gray-900">{f.titre}</span>
                        <span className="ml-2 text-gray-500 text-sm">
                          (Début : {f.date_debut?.substring(0, 10)}, Fin : {f.date_fin?.substring(0, 10)})
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                          className="bg-blue-900 hover:bg-blue-700 text-white px-4 py-1 rounded transition"
                          onClick={() => window.location.href = `/formations/${f.id}`}
                        >
                          Voir la description
                        </button>
                        <button
                          className={`px-4 py-1 rounded transition 
                            ${annulable ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                          disabled={!annulable}
                          onClick={() => annulable && handleAnnulerInscription(f.id, f.date_debut)}
                        >
                          Annuler l’inscription
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {message && <p className="text-green-600 mt-4 font-semibold">{message}</p>}
          {error && <p className="text-red-600 mt-4 font-semibold">{error}</p>}
        </section>
      </main>
    </div>
  );
}
