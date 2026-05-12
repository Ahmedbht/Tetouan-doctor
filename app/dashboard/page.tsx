"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, User, Calendar, Clock, Phone, Mail, FileText, Plus, LogOut } from "lucide-react";

type Booking = {
  id: number;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  notes: string;
};

type TimeSlot = {
  id: number;
  date: string;
  time: string;
  is_booked: boolean;
};

export default function Dashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [newSlot, setNewSlot] = useState({ date: "", time: "" });
  const [doctorName, setDoctorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  // animation on load
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const timeOptions = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const doctor_id = localStorage.getItem("doctor_id");
    const name = localStorage.getItem("doctor_name");

    // back to login if no token or doctor_id in local storage (not logged in)
    if (!token || !doctor_id) {
      router.push("/login");
      return;
    }

    setDoctorName(name || "");

    // import slots et bookings of doctor from django
    const fetchData = async () => {
      const [bookingsRes, slotsRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/doctor/bookings/${doctor_id}/`, {
          headers: { Authorization: `Token ${token}` },
        }),
        fetch(`http://127.0.0.1:8000/api/slots/${doctor_id}/`, {
          headers: { Authorization: `Token ${token}` },
        }),
      ]);
      const bookingsData = await bookingsRes.json();
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      console.log("bookings:", bookingsData);
      const slotsData = await slotsRes.json();
      setSlots(slotsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  // doctor add new slot
  const addSlot = async () => {
    if (!newSlot.date || !newSlot.time) {
      alert("Veuillez choisir une date et une heure.");
      return;
    }
    const token = localStorage.getItem("token");
    const doctor_id = localStorage.getItem("doctor_id");
    const res = await fetch("http://127.0.0.1:8000/api/doctor/slots/add/", {
      method: "POST",
      headers: {"Content-Type": "application/json", Authorization: `Token ${token}`},
      body: JSON.stringify({ doctor: doctor_id, date: newSlot.date, time: newSlot.time }),
    });
    if (res.ok) {
      const data = await res.json();
      setSlots([...slots, data]);
      setNewSlot({ date: "", time: "" });
    }
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("doctor_id");
    localStorage.removeItem("doctor_name");
    router.push("/login");
  };

  if (loading) return <p className="text-center mt-20 text-gray-500">Chargement...</p>;

  return (
    <main className="min-h-screen bg-gray-50 font-sans">

      {/* nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black text-blue-700">Tetouan Doctor</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <p className="text-gray-600 text-sm font-semibold flex items-center gap-1">
              <User className="w-4 h-4" /> <span className="hidden md:inline">{doctorName}</span>
            </p>
            <button onClick={handleLogout} className="text-sm text-red-500 font-bold hover:text-red-700 transition flex items-center gap-1">
              <LogOut className="w-4 h-4" /> <span className="hidden md:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </nav>

      <section className={`py-8 md:py-12 px-4 md:px-8 max-w-6xl mx-auto space-y-6 md:space-y-10 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

        {/* stats */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm text-center">
            <p className="text-3xl md:text-4xl font-black text-blue-700">{bookings.length}</p>
            <p className="text-gray-500 text-sm mt-1">Rendez-vous</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm text-center">
            <p className="text-3xl md:text-4xl font-black text-green-600">{slots.length}</p>
            <p className="text-gray-500 text-sm mt-1">Slots disponibles</p>
          </div>
        </div>

        {/* add slot */}
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm">
          <h2 className="font-black text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-700" /> Ajouter un slot disponible
          </h2>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <p className="text-sm text-gray-500 mb-2">Date</p>
              <input type="date" value={newSlot.date}
                onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 text-gray-700" />
            </div>
            <div className="flex-1 w-full">
              <p className="text-sm text-gray-500 mb-2">Heure</p>
              <select value={newSlot.time}
                onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 text-gray-700">
                <option value="">-- Choisir --</option>
                {timeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <button onClick={addSlot} className="w-full md:w-auto bg-blue-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-800 transition">
              Ajouter
            </button>
          </div>
        </div>

        {/*add slots*/}
        {/*slots list*/}
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm">
          <h2 className="font-black text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-700" /> Mes Slots disponibles
          </h2>
          {slots.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun slot pour le moment.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {slots.map((s) => (
                <div key={s.id} className="border border-gray-100 rounded-xl p-3 text-center">
                  <p className="font-bold text-gray-900">{s.date}</p>
                  <p className="text-blue-600 text-sm font-semibold">{s.time}</p>
                  <div className={`mt-2 text-xs font-bold px-2 py-1 rounded-full ${s.is_booked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                    {s.is_booked ? "Réservé" : "Disponible"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* bookings */}
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm">
          <h2 className="font-black text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-700" /> Mes Rendez-vous
          </h2>
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun rendez-vous pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <p className="font-bold text-gray-900">{b.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.date} à {b.time}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {b.phone}</p>
                  </div>
                  <div className="md:text-right">
                    <p className="text-sm text-gray-500 flex items-center gap-1 md:justify-end"><Mail className="w-3 h-3" /> {b.email}</p>
                    {b.notes && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 md:justify-end"><FileText className="w-3 h-3" /> {b.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

      <footer className="bg-blue-900 text-blue-300 text-center py-6 text-sm">
        2026 © Tetouan Doctor. Tétouan, Maroc.
      </footer>

    </main>
  );
}