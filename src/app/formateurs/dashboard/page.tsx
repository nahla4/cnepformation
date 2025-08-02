'use client';
import { useEffect, useState } from 'react';

export default function DashboardFormateur() {
  const [formateur, setFormateur] = useState<any>(null);
  const [formations, setFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupère l'id du formateur connecté (stocké dans le localStorage à la connexion)
  const formateurId =
    typeof window !== "undefined"
      ? localStorage.getItem('formateurId')
      : null;

  // Charger les infos du formateur puis ses formations
  useEffect(() => {
    if (!formateurId) {
      setLoading(false);
      return;
    }
    // Charger le formateur et stocker son domaine NOM **et** ID dans le localStorage
    fetch(`http://localhost:3000/api/formateurs/${formateurId}`)
      .then(res => res.json())
      .then(data => {
        setFormateur(data);
        // ⚠️ LIGNE IMPORTANTE : stock domaine et domaine_id à chaque connexion
        if (data && data.domaine && data.domaine_id) {
          localStorage.setItem('domaineFormateur', data.domaine);         // nom texte
          localStorage.setItem('domaineIdFormateur', data.domaine_id);    // id numérique
        }
      });

    // Charger les formations animées par ce formateur
    fetch(`http://localhost:3000/api/formations/formateur/${formateurId}`)
      .then(res => res.json())
      .then(data => setFormations(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [formateurId]);

  if (loading) {
    return <div>Chargement...</div>;
  }
  if (!formateur) {
    return <div className="text-red-700 text-lg p-8">Formateur non trouvé ou non connecté.</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#c1121f]/10 flex flex-col">
      {/* Header */}
      <header className="w-full px-8 py-6 flex flex-col sm:flex-row justify-between items-center bg-[#1a1a1a] shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
          Bonjour, <span className="text-[#c1121f]">{formateur.prenom} {formateur.nom}</span>
        </h1>
        <button
          className="mt-4 sm:mt-0 bg-[#c1121f] hover:bg-[#a30d18] text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          onClick={() => {
            localStorage.removeItem('formateurId');
            localStorage.removeItem('domaineFormateur');
            localStorage.removeItem('domaineIdFormateur');
            window.location.href = '/formateurs/connexion';
          }}
        >
          Déconnexion
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-8 p-8 w-full max-w-7xl mx-auto">
        {/* Bloc Infos Perso */}
        <section className="flex-1 bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col justify-between min-w-[320px]">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Mes informations</h2>
            <div className="space-y-3 text-gray-800">
              <div><span className="font-semibold">Email :</span> {formateur.email}</div>
              <div><span className="font-semibold">Téléphone :</span> {formateur.numero_telephone}</div>
              <div><span className="font-semibold">Domaine :</span> {formateur.domaine}</div>
            </div>
          </div>
          <button
            className="mt-8 bg-white border border-[#c1121f] text-[#c1121f] hover:bg-[#c1121f] hover:text-white font-semibold px-5 py-2 rounded-lg transition shadow"
            onClick={() => window.location.href = '/formateurs/modifier'}
          >
            Modifier mes informations
          </button>
        </section>

        {/* Bloc Formations */}
        <section className="flex-[2] bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-900">
              Mes formations animées
            </h2>
            <button
              className="mt-4 sm:mt-0 bg-[#c1121f] hover:bg-[#a30d18] text-white font-semibold px-6 py-2 rounded-lg shadow transition"
              onClick={() => window.location.href = '/formateurs/gestionformation'}
            >
              Ajouter une formation
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {(Array.isArray(formations) ? formations : []).length === 0 ? (
              <p className="text-gray-600">Aucune formation pour le moment.</p>
            ) : (
              <div className="grid gap-4">
                {(Array.isArray(formations) ? formations : []).map((f: any) => (
                  <div
                    key={f.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-[#f2f2f2] via-white to-[#f2f2f2] rounded-xl p-5 shadow hover:shadow-lg transition"
                  >
                    <div>
                      <span className="font-semibold text-lg text-gray-900">{f.titre}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                      <button
                        className="bg-[#c1121f] hover:bg-[#a30d18] text-white px-4 py-1 rounded transition"
                        onClick={() => window.location.href = `/formateurs/formation/${f.id}`}
                      >
                        Voir la description
                      </button>
                      <button
                        className="bg-blue-900 hover:bg-blue-700 text-white px-4 py-1 rounded transition"
                        onClick={() => window.location.href = `/formateurs/formation/${f.id}/modifierfor`}
                      >
                        Modifier
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded transition"
                        onClick={() => window.location.href = `/formateurs/formation/${f.id}/candidats`}
                      >
                        Voir les candidats
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
