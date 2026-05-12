"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Stethoscope, User, Clock, Star, CheckCircle, XCircle } from "lucide-react";

type Doctor = {
    id: number;
    name: string;
    specialite: string;
    experience: string;
    rating: number;
    disponible: boolean;
};
const specialites = ["Tous", "Médecine Générale", "Dentisterie", "Ophtalmologie", "Neurologie", "Orthopédie", "Pédiatrie"];

export default function Doctors() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("Tous"); // filter ديال specialité
    const [visible, setVisible] = useState(false);
    // animation on load
    useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

    //import doctors from django
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/doctors/");
                const data = await res.json();
                setDoctors(data);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchDoctors();
    }, []);

    // filter doctor (specialiste)
    const filteredDoctors = filter === "Tous" ? doctors : doctors.filter((d) => d.specialite === filter);

    return (
        <main className="min-h-screen bg-gray-50 font-sans">
            {/*nav*/}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-black text-blue-700">Tetouan Doctor</h1>
                    </Link>
                    {/* mobile: hidden, desktop: show */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                        <Link href="/" className="hover:text-blue-700 transition">Accueil</Link>
                        <Link href="/booking" className="bg-blue-700 text-white px-5 py-2 rounded-full hover:bg-blue-800 transition">Prendre RDV</Link>
                    </div>
                    {/* mobile: rdv only */}
                    <Link href="/booking" className="md:hidden bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold">RDV</Link>
                </div>
            </nav>
            {/*header*/}
            <section className={`bg-gradient-to-br from-blue-700 to-blue-500 text-white py-16 px-4 text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <h2 className="text-4xl font-black mb-4">Nos Médecins</h2>
                <p className="text-blue-100 text-lg max-w-xl mx-auto">Des professionnels de santé qualifiés à Tétouan.</p>
            </section>
            {/*filter button*/}
            <section className="py-8 px-4 md:px-8">
                <div className="max-w-6xl mx-auto flex flex-wrap gap-3 justify-center">
                    {specialites.map((s) => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${filter === s ? "bg-blue-700 text-white border-blue-700" : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </section>
            {/*doctors list*/}
            <section className="py-8 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <p className="text-center text-gray-500">Chargement...</p>
                    ) : filteredDoctors.length === 0 ? (
                        <p className="text-center text-gray-500">Aucun médecin disponible pour cette spécialité.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {filteredDoctors.map((d, i) => (
                                <div key={d.id}
                                    className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                    style={{ transitionDelay: `${i * 100}ms` }}>
                                    {/* avatar */}
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                        <User className="w-8 h-8 text-blue-700" />
                                    </div>
                                    {/* infos */}
                                    <h3 className="text-lg font-black text-gray-900">{d.name}</h3>
                                    <p className="text-blue-600 text-sm font-semibold mt-1">{d.specialite}</p>
                                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1"><Clock className="w-4 h-4" /> {d.experience} d'expérience</p>
                                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> {d.rating} / 5</p>
                                    {/* disponibilité */}
                                    <p className={`text-sm font-bold mt-1 flex items-center gap-1 ${d.disponible ? "text-green-500" : "text-red-500"}`}>
                                        {d.disponible ? <><CheckCircle className="w-4 h-4" /> Disponible</> : <><XCircle className="w-4 h-4" /> Non disponible</>}
                                    </p>
                                    {/* send doctor_id in url*/}
                                    <Link href={`/booking?doctor=${d.id}`} className={`mt-4 block text-center py-2 rounded-xl text-sm font-bold transition ${d.disponible ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-gray-100 text-gray-400 pointer-events-none"}`}>
                                        Prendre RDV
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <footer className="bg-blue-900 text-white text-center py-6 text-sm">
                2026 © Tetouan Doctor. Tétouan, Maroc.
            </footer>
        </main>
    );
}