import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message);
                return;
            }

            // Login context এ save করো
            login(data.user, data.token);

            // Role অনুযায়ী redirect করো
            if (data.user.role === 'farmer') {
                navigate('/farmer');
            } else if (data.user.role === 'buyer') {
                navigate('/buyer');
            } else if (data.user.role === 'admin') {
                navigate('/admin');
            }

        } catch (err) {
            setError('Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-600">
                        🌱 কৃষকমার্ট

                    </h1>
                    <p className="text-gray-500 mt-2">আপনার অ্যাকাউন্টে লগইন করুন</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                        ❌ {error}
                    </div>
                )}

                {/* Email */}
                <div className="mb-4">
                    <label className="text-gray-700 font-medium mb-2 block">
                        📧 Email
                    </label>
                    <input
                        type="email"
                        placeholder="আপনার email লিখুন"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label className="text-gray-700 font-medium mb-2 block">
                        🔒 Password
                    </label>
                    <input
                        type="password"
                        placeholder="আপনার password লিখুন"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                    />
                </div>

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50">
                    {loading ? '⏳ Loading...' : '🔐 Login'}
                </button>

                {/* Signup Link */}
                <p className="text-center text-gray-500 mt-4">
                    অ্যাকাউন্ট নেই?{' '}
                    <Link to="/signup" className="text-green-600 font-medium hover:underline">
                        Signup করুন
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;