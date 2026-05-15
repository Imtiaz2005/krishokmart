import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Admin এর জন্য আলাদা handling
        if (user.role === 'admin') {
            setProfile({
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: new Date(),
                total_orders: 0,
                total_spent: 0,
                recent_orders: []
            });
            setLoading(false);
            return;
        }
        fetchProfile();
    }, [user]);
    const fetchProfile = async () => {
        try {
            const currentToken = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/profile', {
                headers: { 'authorization': currentToken }
            });
            const data = await res.json();
            setProfile(data);
        } catch (err) {
            console.log('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">⏳ Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Cover */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 h-48 relative">
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                    <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center text-6xl">
                        {user.role === 'farmer' ? '👨‍🌾' : user.role === 'buyer' ? '🛒' : '🛠️'}
                    </div>
                </div>
            </div>

            {/* Profile Info */}
            <div className="max-w-4xl mx-auto px-4 pt-24 pb-10">

                {/* Name & Role */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {profile?.name}
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'farmer'
                            ? 'bg-green-100 text-green-700'
                            : user.role === 'buyer'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                            {user.role === 'farmer' ? '👨‍🌾 Farmer' :
                                user.role === 'buyer' ? '🛒 Buyer' : '🛠️ Admin'}
                        </span>
                        {user.role === 'farmer' && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile?.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {profile?.status === 'approved' ? '✅ Approved' : '⏳ Pending'}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500 mt-2">📧 {profile?.email}</p>
                    <p className="text-gray-400 text-sm mt-1">
                        📅 যোগ দিয়েছেন: {new Date(profile?.created_at).toLocaleDateString('bn-BD')}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {user.role === 'buyer' && (
                        <>
                            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                <p className="text-4xl font-bold text-blue-500">
                                    {profile?.total_orders || 0}
                                </p>
                                <p className="text-gray-500 mt-2 text-sm">মোট Orders</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                <p className="text-4xl font-bold text-green-600">
                                    ৳{parseFloat(profile?.total_spent || 0).toFixed(0)}
                                </p>
                                <p className="text-gray-500 mt-2 text-sm">মোট খরচ</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                <p className="text-4xl font-bold text-purple-500">
                                    {profile?.recent_orders?.filter(o => o.status === 'confirmed').length || 0}
                                </p>
                                <p className="text-gray-500 mt-2 text-sm">Confirmed Orders</p>
                            </div>
                        </>
                    )}

                    {user.role === 'farmer' && (
                        <>
                            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                <p className="text-4xl font-bold text-green-600">
                                    {profile?.total_products || 0}
                                </p>
                                <p className="text-gray-500 mt-2 text-sm">মোট Products</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                <p className="text-4xl font-bold text-blue-500">
                                    {profile?.total_orders || 0}
                                </p>
                                <p className="text-gray-500 mt-2 text-sm">মোট Orders</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                <p className="text-4xl font-bold text-yellow-500">
                                    ৳{parseFloat(profile?.total_earnings || 0).toFixed(0)}
                                </p>
                                <p className="text-gray-500 mt-2 text-sm">মোট আয়</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {user.role === 'buyer' ? '📋 সাম্প্রতিক Orders' : '🌾 সাম্প্রতিক Products'}
                    </h2>

                    {/* Buyer Recent Orders */}
                    {user.role === 'buyer' && (
                        <div className="flex flex-col gap-3">
                            {profile?.recent_orders?.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">কোনো order নেই।</p>
                            ) : (
                                profile?.recent_orders?.map((order) => (
                                    <div key={order.order_id}
                                        className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                🌾 {order.product_name}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                📦 {order.quantity}kg | 👨‍🌾 {order.farmer_name}
                                            </p>
                                            <p className="text-gray-400 text-xs">
                                                🕐 {new Date(order.order_date).toLocaleDateString('bn-BD')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">
                                                ৳{order.total_price}
                                            </p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : order.status === 'confirmed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {order.status === 'pending' ? '⏳ Pending' :
                                                    order.status === 'confirmed' ? '✅ Confirmed' :
                                                        '❌ Cancelled'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Farmer Recent Products */}
                    {user.role === 'farmer' && (
                        <div className="flex flex-col gap-3">
                            {profile?.recent_products?.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">কোনো product নেই।</p>
                            ) : (
                                profile?.recent_products?.map((product) => (
                                    <div key={product.product_id}
                                        className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                🌾 {product.name}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                📂 {product.category_name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">
                                                ৳{product.price}/kg
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                📦 {product.quantity}kg
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Back Button */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors">
                        ← ফিরে যান
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Profile;