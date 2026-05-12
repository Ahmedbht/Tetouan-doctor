"use client";
import Link from "next/link";
import { Stethoscope, Smile, Eye, Brain, Bone, Baby, Calendar, Users, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const services = [
  { icon: Stethoscope, name : "Médecine Générale", description: "Consultations pour tous les âges et tous les problèmes de santé."},
  { icon: Smile, name: "Dentisterie", description: "Soins dentaires pour toute la famille." },
  { icon: Eye, name: "Ophtalmologie", description: "Examens et traitements pour les problèmes de vision." },
  { icon: Brain, name: "Neurologie", description: "Maladies du système nerveux." },
  { icon: Bone, name: "Orthopédie", description: "Os, articulations et muscles." },
  { icon: Baby, name: "Pédiatrie", description: "Santé des enfants et nourrissons." },  
]

export default function Home(){
  const [visible, setVisible] = useState(false);
  // animation on load
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return(
    <main className="min-h-screen bg-white font-sans">
      {/*nav*/}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-6-xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black text-blue-700">Tetouan Doctors</h1>
          </div>
          {/* mobile: hidden, desktop: show */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#services" className="hover:text-blue-700 transition">Services</a>
            <Link href="/doctors" className="hover:text-blue-700 transition ">Medecins</Link>
            <Link href="/booking" className="bg-blue-700 text-white px-5 py-2 rounded-full hover:bg-blue-800 transition">Prendre RDV</Link>
          </div>
          {/* mobile: rdv only */}
          <Link href="/booking" className="md:hidden bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold">RDV</Link>
        </div>
      </nav>

      {/*hero*/}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12 ">
        {/* its for left text*/}
        <div className={`flex-1 max-w-lg text-center md:text-left transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            Votre sante,<br/> <span className="text-blue-700">notre priorite</span></h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">Prenez rendez-vous avec nos médecins spécialistes à Tétouan en quelques clics. Disponible 24h/24.</p>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Link href="/booking" className="bg-blue-700 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-800 transition shadow-lg">Prendre RDV</Link>
              <Link href="/doctors" className="text-blue-700 font-bold px-8 py-3 rounded-full border border-blue-200 hover:bg-blue-50 transition shadow-lg">Voir les medecins</Link>
            </div>
        </div>

        {/* right one (cards)*/}
        <div className="flex-1 relative h-96 hidden md:block">
          <div className=" right-0 w-56 h-64 rounded-3xl overflow-hidden shadow-lg">
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" alt="Doctor" className="w-full h-full object-cover "></img>
          </div>
          <div className="absolute bottom-0 left-72 w-52 h-56 rounded-3xl overflow-hidden shadow-xl">
            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80" alt="Doctor" className="w-full h-full object-cover"></img>
          </div>
          <div className="absolute top-6 left-72 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900">RDV confirme</p>
              <p className="text-xs text-gray-500">Dr.Karim -10:00</p>
            </div>
          </div>
          <div className="absolute bottom-8 left-0 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900">50+ Médecins</p>
              <p className="text-xs text-gray-500">disponible maitenant</p>
            </div>
          </div>
        </div>
      </section>

      {/*ls stats*/}
      <section className="bg-blue-900 text-white py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 md:gap-8 text-center px-4 md:px-8">
          <div>
            <p className="text-3xl md:text-4xl font-black text-blue-3">+50</p>
            <p className="text-blue-200 text-xs md:text-sm mt-1">Médecins disponibles</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-blue-3">+1000</p>
            <p className="text-blue-200 text-xs md:text-sm mt-1">Patients satisfaits</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-blue-3">24/7</p>
            <p className="text-blue-200 text-xs md:text-sm mt-1">Disponibilité</p>
          </div>
        </div>
      </section>

      {/*srvs*/}
      <section id="services" className="py-12 md:py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-12 ">Nos Spécialités</h2>
          {/* mobile: 1 col, tablet: 2, desktop: 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            { services.map((s, i) => (
              <div key={s.name}
                className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold mt-4 text-gray-900">{s.name}</h3>
                <p className="text-gray-600 mt-2">{s.description}</p>
                <Link href="/doctors" className="text-blue-600 text-sm font-semibold mt-3 flex items-center gap-1 hover:text-blue-800">
                  Voir les médecins <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-blue-900 text-blue-300 text-center py-6 text-sm">2026 Tetouan Doctor. Tetouan, Maroc</footer>
    </main>
  )
}