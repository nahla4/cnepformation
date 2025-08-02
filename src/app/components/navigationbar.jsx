// components/NavigationBar.jsx

import Image from 'next/image';

export default function NavigationBar() {
  return (
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
            CNEP Formation Tracker
          </span>
        </div>
        <nav className="space-x-6 hidden sm:flex text-base font-medium">
          <a href="/" className="hover:text-[#c1121f] transition">Accueil</a>
          <a href="/formations" className="hover:text-[#c1121f] transition">Formations</a>
          <a href="#contact" className="hover:text-[#c1121f] transition">Contact</a>
        </nav>
      </div>
    </header>
  );
}
