'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader } from "lucide-react";

export default function Login() {

    const router = useRouter();


    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post(
                '/api/admin/login',
                formData,
                { withCredentials: true }
            );

            router.push('/admin/panel');

        } catch (err: any) {
            setError(err?.response?.data?.error || 'Login failed. Try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6">
                <div className="flex flex-col items-center">
                    <img src="/logo.png" alt="Revelo Logo" className="h-16 mb-2" />
                    <p className="text-gray-500 text-xs text-center">
                        Centralized Platform for College Fests & Admin Access
                    </p>
                </div>

                <h2 className="text-white text-lg font-medium text-center">Admin Panel Login</h2>

                {error && (
                    <div className="text-sm text-red-500 bg-red-900/20 border border-red-700 rounded px-3 py-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-gray-300 text-sm block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="admin@revelo.in"
                            className="w-full px-4 py-2 rounded bg-[#1a1a1a] text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#333] transition-all"
                            onChange={handleChange}
                            value={formData.email}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-gray-300 text-sm block mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 rounded bg-[#1a1a1a] text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#333] transition-all"
                            onChange={handleChange}
                            value={formData.password}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 text-sm rounded bg-[#1a1a1a] hover:bg-[#2c2c2c] border border-gray-700 text-white transition-all disabled:opacity-60"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader className="w-4 h-4 animate-spin" />
                                Signing in...
                            </span>
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
