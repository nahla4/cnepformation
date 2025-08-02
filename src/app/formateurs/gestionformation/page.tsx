'use client';
import { useEffect, useState } from 'react';

export default function GestionFormationFormateur() {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [domaine, setDomaine] = useState('');
  const [domaineId, setDomaineId] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [duree, setDuree] = useState<number | ''>(''); // durée numérique ou vide
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formateurId = typeof window !== "undefined" ? localStorage.getItem('formateurId') : null;
  const storedDomaineNom = typeof window !== "undefined" ? localStorage.getItem('domaineFormateur') || "" : "";
  const storedDomaineId = typeof window !== "undefined" ? localStorage.getItem('domaineIdFormateur') || "" : "";

  useEffect(() => {
    setDomaine(storedDomaineNom);
    setDomaineId(storedDomaineId);
  }, [storedDomaineNom, storedDomaineId]);

  // Calcul automatique de la durée en jours
  useEffect(() => {
    if (dateDebut && dateFin) {
      const debut = new Date(dateDebut);
      const fin = new Date(dateFin);
      if (fin >= debut) {
        const diffTime = fin.getTime() - debut.getTime();
        const nbJours = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDuree(nbJours);
      } else {
        setDuree('');
      }
    } else {
      setDuree('');
    }
  }, [dateDebut, dateFin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    if (!formateurId) {
      setError("Formateur non identifié.");
      setLoading(false);
      return;
    }
    if (!dateDebut || !dateFin) {
      setError("Les dates sont obligatoires.");
      setLoading(false);
      return;
    }
    if (duree === '' || duree <= 0) {
      setError("La durée de la formation n'est pas valide.");
      setLoading(false);
      return;
    }
    if (new Date(dateDebut) > new Date(dateFin)) {
      setError("La date de début doit être avant la date de fin.");
      setLoading(false);
      return;
    }

    try {
      const payload: any = {
        titre,
        description,
        date_debut: dateDebut,
        date_fin: dateFin,
        duree_en_jours: duree,
        formateur_id: formateurId,
      };
      if (domaineId) {
        payload.domaine_id = domaineId;
      }

      const res = await fetch('http://localhost:3000/api/formations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la création.");
        setLoading(false);
        return;
      }
      setSuccess('Formation créée avec succès !');
      setTitre('');
      setDescription('');
      setDateDebut('');
      setDateFin('');
      setDuree('');
    } catch {
      setError('Erreur lors de la connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex justify-center items-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-lg w-full p-10 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center text-[#c1121f] mb-6">Créer une Formation</h1>

        <input
          type="text"
          placeholder="Titre de la formation"
          value={titre}
          onChange={e => setTitre(e.target.value)}
          className="mb-4 w-full border px-4 py-3 rounded shadow-sm text-sm text-gray-900 placeholder-gray-900"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="mb-4 w-full border px-4 py-3 rounded shadow-sm text-sm text-gray-900 placeholder-gray-900"
          rows={3}
        />
        {domaine && (
          <div className="mb-4">
            <label className="block text-gray-900 font-medium mb-1">Domaine</label>
            <input
              type="text"
              value={domaine}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 text-sm shadow-sm text-gray-900 cursor-not-allowed"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-900 font-medium mb-1">Date de début</label>
          <input
            type="date"
            value={dateDebut}
            onChange={e => setDateDebut(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-3 text-sm shadow-sm text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 font-medium mb-1">Date de fin</label>
          <input
            type="date"
            value={dateFin}
            onChange={e => setDateFin(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-3 text-sm shadow-sm text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 font-medium mb-1">Durée en jours</label>
          <input
            type="number"
            min={1}
            value={duree === '' ? '' : duree}
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 text-sm shadow-sm text-gray-900 cursor-not-allowed"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        <button
          type="submit"
          className="w-full bg-[#c1121f] hover:bg-[#a30d18] text-white py-3 rounded font-semibold transition"
          disabled={loading || !duree || duree <= 0}
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
