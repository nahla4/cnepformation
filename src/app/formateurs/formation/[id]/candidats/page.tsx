'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CandidatsInscrits() {
  const { id } = useParams();
  const [candidats, setCandidats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/formations/${id}/candidats`)
      .then(res => res.json())
      .then(data => setCandidats(data))
      .catch(() => setCandidats([]))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#c1121f]/10 px-4 py-10">
      <div className="bg-white max-w-2xl w-full p-10 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-[#c1121f] mb-6">Candidats inscrits à la formation #{id}</h1>
        {loading ? (
          <p className="text-gray-600">Chargement...</p>
        ) : (
          <>
            {candidats.length === 0 ? (
              <p className="text-gray-600">Aucun candidat inscrit pour le moment.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {candidats.map((c, idx) => (
                  <li key={idx} className="py-3 flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-900">{c.prenom} {c.nom}</span>
                    <span className="text-gray-700 text-sm">{c.email}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        <button
          className="mt-8 bg-[#c1121f] hover:bg-[#a30d18] text-white font-semibold px-6 py-2 rounded transition"
          onClick={() => window.location.href = '/formateurs/dashboard'}
        >
          Retour au dashboard
        </button>
      </div>
    </div>
  );
}
