import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { LightBulbIcon } from './Icons';

const AuthPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-slate-100 p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl mb-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <LightBulbIcon className="h-12 w-12 text-yellow-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-sky-400">
            NutriSnap AI
          </h1>
        </div>
        <p className="text-slate-300 text-lg">Your personal nutrition analyzer, powered by AI</p>
      </header>

      <main className="w-full max-w-md bg-slate-800 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden">
        <div className="flex mb-0">
          <button
            onClick={() => setShowLogin(true)}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              showLogin
                ? 'bg-slate-700 text-sky-400 border-b-2 border-sky-400'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              !showLogin
                ? 'bg-slate-700 text-sky-400 border-b-2 border-sky-400'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign Up
          </button>
        </div>
        <div className="p-6">
          {showLogin ? (
            <Login onRegisterClick={() => setShowLogin(false)} />
          ) : (
            <Register onLoginClick={() => setShowLogin(true)} />
          )}
        </div>
      </main>

      <footer className="w-full max-w-md mt-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} NutriSnap AI. Powered by Gemini.</p>
        <p>Nutritional information is an estimate and should not be used for medical purposes.</p>
      </footer>
    </div>
  );
};

export default AuthPage; 