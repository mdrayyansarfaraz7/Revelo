'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function InstituteLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

    };

    return (
        <div className="min-h-screen flex bg-[#111111]  text-white">
            {/* Left Side - Login */}
            <div className="w-full md:w-1/3 flex items-center justify-center px-6 md:px-12">
                <div className="max-w-md w-full">
                    <Image
                        src="/logo.png"
                        alt="Revelo Logo"
                        width={120}
                        height={40}
                        className="mb-10"
                    />
                    <h2 className="text-3xl font-bold mb-6">Institute Sign In</h2>
                    <p className="mb-8 text-sm text-gray-400">
                        Manage your institute's presence, host events, and empower your students.
                    </p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium">Institute Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 rounded-md bg-[#111111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="you@institute.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 rounded-md bg-[#111111]  text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-[#171735]   hover:bg-[#131321]  rounded-md text-white font-semibold transition duration-200"
                        >
                            Signin
                        </button>
                    </form>
                    <p className="mt-6 text-sm text-gray-500">
                        Not registered yet?{' '}
                        <a href="/institute/signup" className="text-purple-400 hover:underline">
                            Register your Institution
                        </a>
                    </p>
                </div>
            </div>

            {/* Right Side - Image & Tagline */}
            <div
                className="hidden md:block md:w-3/4 bg-cover bg-center relative"
                style={{ backgroundImage: `url('/login.png')` }}
            >
                <div className="absolute inset-0 bg-[#111111]/60 z-10 flex flex-col justify-center items-center p-10">
                    <h2 className="text-4xl font-bold text-white mb-4 leading-snug text-center">
                        “Empower Talent. Showcase Brilliance.”
                    </h2>
                    <p className="text-lg text-purple-400 text-center max-w-md">
                        Bring your campus to the spotlight with Revelo’s all-in-one event platform.
                    </p>
                </div>
            </div>
        </div>
    );
}
