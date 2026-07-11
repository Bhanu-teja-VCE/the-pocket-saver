import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet } from 'lucide-react';

export function Login() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && name) {
            login(email, name);
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
                        <Wallet className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                            placeholder="john@example.com"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>This is a demo app. No password required.</p>
                </div>
            </div>
        </div>
    );
}
