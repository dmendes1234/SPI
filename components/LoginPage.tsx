
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string, password_input: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password_input, setPassword_input] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password_input);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Prijavite se</h2>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Korisničko ime</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            required
            aria-label="Unesite korisničko ime"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Lozinka</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password_input}
            onChange={(e) => setPassword_input(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            required
            aria-label="Unesite lozinku"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Prijava
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;