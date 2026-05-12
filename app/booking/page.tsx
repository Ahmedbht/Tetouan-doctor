"use client";
import { useEffect,useState } from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import { Stethoscope, User, Clock, FileText, CheckCircle } from "lucide-react";
import{Suspense} from 'react';

type TimeSlot ={
  id : number;
  date : string;
  time :string;
}
 function BookingContent() {

const searchParams = useSearchParams();
const doctorId = searchParams.get("doctor") || "1"; //its default doctor id = 1 for exemple

const[slots, setSlots] = useState <TimeSlot[]>([]);
const [selectedSlot ,setSelectedSlot] = useState<TimeSlot | null>(null);
const [visible, setVisible] = useState(false);
//animation on load
useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

useEffect(() =>{
  fetch(`http://127.0.0.1:8000/api/slots/${doctorId}/`)
.then ((res) => res.json())
.then ((data) => setSlots(Array.isArray(data) ? data : []));
}, [doctorId]);

  const [form, setForm] = useState({
    name: "", phone: "", email: "", service: "", date: "", time: "", notes: "",
  });
  const [submited, setSubmited] = useState(false);
  // false in the beginning so when click confirmer ==> true => show confirmation
  const handleSubmit = async () => {
      if(!form.name || !form.phone || !form.email || !selectedSlot){
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
      }
      try{
        console.log("sending:", {doctor: doctorId, slot_id: selectedSlot.id, name: form.name, phone: form.phone, email: form.email, date: selectedSlot?.date , time: selectedSlot?.time, notes: form.notes,});
        const res =await fetch("http://127.0.0.1:8000/api/bookings/create/",{
          method: "POST", headers:{"Content-type": "application/json"}, body:JSON.stringify({
            doctor:doctorId,
            slot_id : selectedSlot.id,
            name : form.name, phone : form.phone, email: form.email,
          service: "consultation",  //default i prefer it because of a problem i faced
          date: selectedSlot.date,
          time: selectedSlot.time,    
          notes: form.notes,
          }),
        });
        if(res.ok){
          setSubmited(true); } else{
            const errorData = await res.json();
            console.log("Django eror:", errorData);
            alert("Erreur lors de la prise de rendez-vous. Veuillez réessayer.");
          }
        }
        catch(error){
          alert("Erreur de la connexion");
        }
  };
  // if submited = true => show confirmation page
  if (submited){
    return(
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg text-center max-w-md w-full border border-blue-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Rendez-vous confirmé!</h2>
          <p className="text-gray-500 mb-6">Le médecin vous contactera bientôt.</p>
          {/* show customer infos */}
          <div className="bg-blue-50 rounded-2xl p-5 text-left space-y-2 border border-blue-100">
            <p className="text-sm text-gray-700"><strong className="text-gray-900">Nom :</strong> {form.name}</p>
            <p className="text-sm text-gray-700"><strong className="text-gray-900">Téléphone :</strong> {form.phone}</p>
            <p className="text-sm text-gray-700"><strong className="text-gray-900">Email :</strong> {form.email}</p>
            <p className="text-sm text-gray-700"><strong className="text-gray-900">Date :</strong> {selectedSlot?.date}</p>
            <p className="text-sm text-gray-700"><strong className="text-gray-900">Heure :</strong> {selectedSlot?.time}</p>
          </div>
          <Link href="/" className="mt-6 block bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition">Retour à l'accueil</Link>
        </div>
      </main>
    );
  }
  // if submited = false => show form
  return(
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans">
      {/* nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black text-blue-700">Tetouan Doctor</h1>
          </Link>
        </div>
      </nav>
      {/*header*/}
      <div className={`bg-gradient-to-r from-blue-700 to-blue-500 text-white py-12 px-4 text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <h1 className="text-3xl font-black mb-2">Prendre un RDV</h1>
        <p className="text-blue-100">Remplissez le formulaire ci-dessous</p>
      </div>
      {/* form */}
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/*infos*/}
            <div>
              <h2 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-700" />
                </div>
                Informations personnelles
              </h2>
              <div className="space-y-3">
                <input placeholder="Nom complet *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  // ...form keeps other values and changes only name
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 text-gray-800 transition" />
                <input placeholder="Numéro de téléphone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 text-gray-800 transition" />
                <input placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 text-gray-800 transition" />
              </div>
            </div>
            {/*time*/}
            {/* so we get slots from Django */}
            <div>
              <h2 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-700" />
                </div>
                Créneaux disponibles
              </h2>
              {slots.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun créneau disponible.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {slots.map((s) => (
                    <button key={s.id} onClick={() => setSelectedSlot(s)}
                      className={`py-3 px-3 rounded-xl text-sm font-semibold border transition ${selectedSlot?.id === s.id ? "bg-blue-700 text-white border-blue-700 shadow-md" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"}`}>
                      <p>{s.date}</p>
                      <p>{s.time}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/*notes*/}
            <div>
              <h2 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-700" />
                </div>
                Notes <span className="text-gray-400 font-normal text-sm">(Optionnel)</span>
              </h2>
              <textarea placeholder="Décrivez votre problème svp" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 resize-none text-gray-800 transition" />
            </div>
            {/*button submission*/}
            <button onClick={handleSubmit} className="w-full bg-blue-700 text-white font-black py-4 rounded-2xl hover:bg-blue-800 active:scale-95 transition text-lg shadow-lg">
              Confirmer le rendez-vous
            </button>
          </div>{/*end bg-white container*/}
        </div>
      </section>
      <footer className="bg-blue-900 text-blue-300 text-center py-6 text-sm">
        2026 © Tetouan Doctor. Tétouan, Maroc.
      </footer>
    </main>
  );
}
export default function Booking() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <BookingContent />
    </Suspense>
  );
}