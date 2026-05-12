"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope } from "lucide-react";

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    // animation on load
    useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

    const handleLogin = async () => {
        if (!form.username || !form.password) {
            setError("Veuillez remplir tous les champs.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/api/doctor/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok)
                //save token and doctoor id in local storagr
            {
                localStorage.setItem("token", data.token);
                localStorage.setItem("doctor_id", data.doctor_id);
                localStorage.setItem("doctor_name", data.name);
                router.push("/dashboard");
            }
            else {
                setError("Identifications incorrects.");
            }
        }
        catch {
            setError("Erreur de connexion. Veuillez reessayer.");
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
            <div className={`bg-white rounded-3xl p-8 md:p-10 shadow-lg max-w-md w-full border border-blue-100 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                {/*for header*/}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto">
                        <Stethoscope className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mt-4">Espace Médecin</h1>
                    <p className="text-gray-500 mt-2">Connectez-vous à votre dashboard</p>
                </div>

                {/*form*/}
                <div className="space-y-4">
                    <input placeholder="Nom utilisateur"
                        value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 text-gray-800 transition" />
                    <input type="password" placeholder="Mot de passe"
                        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 text-gray-800 transition" />

                    {/*show error if exist*/}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button onClick={handleLogin}
                        className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 active:scale-95 transition">
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </div>
            </div>
        </main>
    );
}