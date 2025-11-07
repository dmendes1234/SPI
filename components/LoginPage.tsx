import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string, password_input: string) => Promise<void>;
  showToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, showToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInitData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/init-data', {
        method: 'POST',
      });
      if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Inicijalizacija baze nije uspjela.');
        } catch(jsonError) {
            throw new Error(`HTTP greška! Status: ${response.status} ${response.statusText}`);
        }
      }
      showToast("Baza je uspješno inicijalizirana. Prijavite se s: SYSLC / test123", 'success');
    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(username, password);
      // On success, the component will unmount, so no need to setLoading(false)
    } catch (error) {
      showToast((error as Error).message, 'error');
      setLoading(false); // Only reset loading state on error
    }
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            required
            aria-label="Unesite lozinku"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Prijavljivanje...' : 'Prijava'}
          </button>
        </div>
      </form>
      <div className="mt-6 pt-6 border-t w-full text-center">
          <p className="text-sm text-gray-600 mb-4">Ukoliko se radi o prvom pokretanju aplikacije ili je baza podataka prazna, inicijalizirajte je.</p>
          <button
            type="button"
            onClick={handleInitData}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Inicijalizacija...' : 'Inicijaliziraj bazu podataka'}
          </button>
      </div>
    </div>
  );
};

export default LoginPage;