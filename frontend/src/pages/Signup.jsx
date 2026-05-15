import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignup = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message);
                return;
            }

            // Farmer হলে approval message
            if (role === 'farmer') {
                setSuccess('✅ Signup সফল! Admin approval এর জন্য অপেক্ষা করুন।');
            } else {
                setSuccess('✅ Signup সফল! এখন Login করুন।');
                setTimeout(() => navigate('/login'), 2000);
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
                    <p className="text-gray-500 mt-2">নতুন অ্যাকাউন্ট তৈরি করুন</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                        ❌ {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm">
                        {success}
                    </div>
                )}

                {/* Name */}
                <div className="mb-4">
                    <label className="text-gray-700 font-medium mb-2 block">
                        👤 নাম
                    </label>
                    <input
                        type="text"
                        placeholder="আপনার নাম লিখুন"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                    />
                </div>

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
                <div className="mb-4">
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

                {/* Role */}
                <div className="mb-6">
                    <label className="text-gray-700 font-medium mb-2 block">
                        🎭 আপনি কে?
                    </label>
                    <div className="flex gap-3">
                        {/* Buyer */}
                        <button
                            onClick={() => setRole('buyer')}
                            className={`flex-1 py-3 rounded-xl font-medium border-2 transition-colors ${
                                role === 'buyer'
                                    ? 'bg-green-600 text-white border-green-600'
                                    : 'bg-white text-gray-600 border-gray-300'
                            }`}>
                            🛒 Buyer
                        </button>

                        {/* Farmer */}
                        <button
                            onClick={() => setRole('farmer')}
                            className={`flex-1 py-3 rounded-xl font-medium border-2 transition-colors ${
                                role === 'farmer'
                                    ? 'bg-green-600 text-white border-green-600'
                                    : 'bg-white text-gray-600 border-gray-300'
                            }`}>
                            👨‍🌾 Farmer
                        </button>
                    </div>
                </div>

                {/* Signup Button */}
                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50">
                    {loading ? '⏳ Loading...' : '📝 Signup'}
                </button>

                {/* Login Link */}
                <p className="text-center text-gray-500 mt-4">
                    আগে থেকে account আছে?{' '}
                    <Link to="/login" className="text-green-600 font-medium hover:underline">
                        Login করুন
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;