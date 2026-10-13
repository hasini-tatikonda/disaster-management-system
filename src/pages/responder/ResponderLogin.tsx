import React, { useState } from "react";
import {
  Radio,
  ShieldCheck,
  Lock,
  ArrowRight
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import { INITIAL_DEMO_RESPONDERS } from "../../data/demoResponders";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export const ResponderLogin: React.FC = () => {
  const { loginResponder } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userEmail = userCredential.user.email || "";

      if (!userEmail.startsWith("responder")) {
        alert("access denied");
        return;
      }

      setAuthenticated(true);
    } catch (error: any) {
      alert(error.code);
    }
  };

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
            <Radio className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Responder Field Portal
          </h2>

          <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900 inline-block">
            DEMO RESPONDER AUTHENTICATION
          </span>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <div className="relative space-y-3">
            <Lock className="w-4 h-4 absolute left-3 top-4 text-slate-400" />

            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="w-full pl-10 p-3 rounded-xl border"
            />

            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="w-full p-3 rounded-xl border"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />

            <span>
              Authenticate Responder
            </span>

            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Select Rescue Team
        </h2>
      </div>

      <div className="space-y-3">
        {INITIAL_DEMO_RESPONDERS.map((resp) => (
          <button
            key={resp.id}
            onClick={() =>
              loginResponder(resp.id)
            }
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-left transition-all flex items-center justify-between group"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-emerald-600">
                  {resp.id}
                </span>

                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {resp.teamName}
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Leader: {resp.leaderName}
              </p>
            </div>

            <ShieldCheck className="w-5 h-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
};