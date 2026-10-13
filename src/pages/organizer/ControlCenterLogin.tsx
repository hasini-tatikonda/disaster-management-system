import React, { useState } from 'react';
import { Building2, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
export const ControlCenterLogin: React.FC = () => {
  const { loginOrganizer } = useApp();
 const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userEmail = userCredential.user.email || "";

    if (
      !userEmail.startsWith("controlroom") &&
      !userEmail.startsWith("admin")
    ) {
      alert("access denied");

      return;
    }

    loginOrganizer();
  } catch (error: any) {
    alert(error.code);
  }
};

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Control Center Operator Portal</h2>
        <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900 inline-block">
          DEMO ORGANIZER AUTHENTICATION
        </span>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
        Access the ResQ organizer dashboard to monitor incoming emergency incidents, assign field responders, and publish disaster alerts.
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Operator ID / Credentials:</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
  type="email"
  placeholder="email"
  value={email}
  onChange={e =>
    setEmail(e.target.value)
  }
  required
/>

<input
  type="password"
  placeholder="password"
  value={password}
  onChange={e =>
    setPassword(e.target.value)
  }
  required
/>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Enter ResQ Control Center</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[11px] text-slate-500 dark:text-slate-400 text-center">
        Demo Login — Click button to access Control Center without real password.
      </div>
    </div>
  );
};
