'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#c1121f]/10 text-black">
      {/* Navbar */}
      <header className="w-full bg-[#1a1a1a]/90 text-white shadow-lg backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/image.png"
              alt="Logo CNEP"
              width={50}
              height={50}
              className="rounded shadow"
              priority
            />
            <span className="text-2xl font-bold tracking-wide text-[#c1121f] drop-shadow-lg">
              CNEP Formation 
            </span>
          </div>
          <nav className="space-x-6 hidden sm:flex text-base font-medium">
            <a href="/" className="hover:text-[#c1121f] transition">Accueil</a>
            <a href="/formations" className="hover:text-[#c1121f] transition">Formations</a>
            <a href="#contact" className="hover:text-[#c1121f] transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center gap-8 bg-gradient-to-tr from-[#c1121f]/10 via-white to-[#f2f2f2]">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-[#c1121f] drop-shadow-lg">
          Bienvenue sur la plateforme CNEP Formation
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl text-gray-700 font-medium">
          Gérez, planifiez et suivez toutes les formations internes de la banque CNEP.<br />
          Accédez à votre espace selon votre profil :
          <span className="text-[#c1121f] font-semibold"> candidat </span>
          ou
          <span className="text-[#c1121f] font-semibold"> formateur</span>.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-5 mt-4 justify-center">
          <a
            className="bg-[#c1121f] hover:bg-[#a30d18] text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-200 text-lg"
            href="/formations"
          >
            Voir les formations
          </a>
          <a
            className="bg-white border-2 border-[#c1121f] text-[#c1121f] hover:bg-[#1a1a1a] hover:text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-200 text-lg"
            href="/candidats/connexion"
          >
            Espace Candidat
          </a>
          <a
            className="bg-white border-2 border-[#c1121f] text-[#c1121f] hover:bg-[#1a1a1a] hover:text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-200 text-lg"
            href="/formateurs/connexion"
          >
            Espace Formateur
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-6 py-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          À propos de la plateforme
        </h2>
        <p className="text-white text-base sm:text-lg font-normal">
          La plateforme CNEP Formation Tracker facilite la gestion des parcours de formation pour tous les collaborateurs de la banque. 
          <br />
          <span className="text-[#c1121f] font-semibold">Simple, rapide et sécurisée</span>, elle permet à chaque utilisateur de suivre ses inscriptions, ses sessions et d’accéder à toutes les informations utiles en quelques clics.
        </p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-[#1a1a1a] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#c1121f]">Contact</h2>
          <div className="flex flex-col gap-4 text-sm sm:text-base">
            <p><strong>Email :</strong> relationclient@cnepbanque.dz</p>
            <p><strong>Téléphone :</strong> 023 36 61 18</p>
            <p><strong>Fax :</strong> 023 36 61 37</p>
            <p><strong>Adresse :</strong> 61 , Bd Souidani Boudjemaa - Cheraga - Alger</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#1a1a1a] text-white text-sm py-5 text-center shadow-inner">
        © 2025 CNEP Formation. Tous droits réservés.
      </footer>
    </div>
  );
}
