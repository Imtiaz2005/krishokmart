import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [farmers, setFarmers] = useState([]);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({});
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    // Login check
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [user]);

    // Stats load করো
    const fetchStats = async () => {
        try {
            const currentToken = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/orders/stats', {
                headers: { 'authorization': currentToken }
            });
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.log('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Farmers load করো
    const fetchFarmers = async () => {
        try {
            const currentToken = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/admin/farmers', {
                headers: { 'authorization': currentToken }
            });
            const data = await res.json();
            setFarmers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log('Error:', err);
        }
    };

    // Products load করো
    const fetchProducts = async () => {
        try {
            const currentToken = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/admin/products', {
                headers: { 'authorization': currentToken }
            });
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log('Error:', err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchStats();
            fetchFarmers();
            fetchProducts();
        }
    }, [token]);

    // Farmer Approve করো
    const handleApprove = async (farmerId) => {
        try {
            const currentToken = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/admin/farmers/approve/${farmerId}`, {
                method: 'PUT',
                headers: { 'authorization': currentToken }
            });

            if (res.ok) {
                alert('✅ Farmer approved!');
                fetchFarmers();
            }
        } catch (err) {
            console.log('Error:', err);
        }
    };

    // Farmer Delete করো
    const handleDeleteFarmer = async (farmerId) => {
        if (!window.confirm('এই farmer কে delete করবেন?')) return;

        try {
            const currentToken = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/admin/farmers/delete/${farmerId}`, {
                method: 'DELETE',
                headers: { 'authorization': currentToken }
            });

            if (res.ok) {
                fetchFarmers();
            }
        } catch (err) {
            console.log('Error:', err);
        }
    };

    // Product Delete করো
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('এই product টি delete করবেন?')) return;

        try {
            const currentToken = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/admin/products/delete/${productId}`, {
                method: 'DELETE',
                headers: { 'authorization': currentToken }
            });

            if (res.ok) {
                fetchProducts();
                fetchStats();
            }
        } catch (err) {
            console.log('Error:', err);
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

            <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">

                {/* Sidebar */}
                <div className="w-64 shrink-0">
                    <div className="bg-white rounded-2xl shadow-md p-4">
                        <div className="text-center mb-6">
                            <div className="text-5xl mb-2">🛠️</div>
                            <h2 className="font-bold text-gray-800">{user?.name}</h2>
                            <span className="text-green-600 text-sm">Admin</span>
                        </div>

                        <nav className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dashboard'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}>
                                📊 Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab('farmers')}
                                className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'farmers'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}>
                                👨‍🌾 Farmers
                            </button>
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'products'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}>
                                📦 Products
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">

                    {/* Dashboard Tab */}
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                📊 Admin Dashboard
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                    <p className="text-4xl font-bold text-green-600">
                                        {stats.total_farmers || 0}
                                    </p>
                                    <p className="text-gray-500 mt-2">মোট Farmers</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                    <p className="text-4xl font-bold text-green-600">
                                        {stats.total_buyers || 0}
                                    </p>
                                    <p className="text-gray-500 mt-2">মোট Buyers</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                    <p className="text-4xl font-bold text-green-600">
                                        {stats.total_products || 0}
                                    </p>
                                    <p className="text-gray-500 mt-2">মোট Products</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                    <p className="text-4xl font-bold text-green-600">
                                        {stats.total_orders || 0}
                                    </p>
                                    <p className="text-gray-500 mt-2">মোট Orders</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                    <p className="text-4xl font-bold text-green-600">
                                        ৳{parseFloat(stats.total_revenue || 0).toFixed(0)}
                                    </p>
                                    <p className="text-gray-500 mt-2">মোট Revenue</p>
                                </div>
                                {/* নতুন cards */}
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center border-2 border-green-200">
                                    <p className="text-4xl font-bold text-green-600">
                                        ৳{parseFloat(stats.total_platform_income || 0).toFixed(0)}
                                    </p>
                                    <p className="text-gray-500 mt-2">Platform Income (10%)</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center border-2 border-blue-200 col-span-2 lg:col-span-1">
                                    <p className="text-4xl font-bold text-blue-500">
                                        ৳{parseFloat(stats.total_farmer_earnings || 0).toFixed(0)}
                                    </p>
                                    <p className="text-gray-500 mt-2">Farmers এর মোট আয় (90%)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Farmers Tab */}
                    {activeTab === 'farmers' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                👨‍🌾 সব Farmers
                            </h2>

                            {farmers.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-md p-10 text-center">
                                    <p className="text-gray-500">কোনো farmer নেই।</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-green-50">
                                            <tr>
                                                <th className="text-left px-4 py-3 text-gray-700">নাম</th>
                                                <th className="text-left px-4 py-3 text-gray-700">Email</th>
                                                <th className="text-left px-4 py-3 text-gray-700">Status</th>
                                                <th className="text-left px-4 py-3 text-gray-700">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {farmers.map((farmer) => (
                                                <tr key={farmer.user_id}
                                                    className="border-t border-gray-100">
                                                    <td className="px-4 py-3 font-medium">
                                                        {farmer.name}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500">
                                                        {farmer.email}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${farmer.status === 'approved'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {farmer.status === 'approved' ? '✅ Approved' : '⏳ Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-2">
                                                            {farmer.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleApprove(farmer.user_id)}
                                                                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700">
                                                                    ✅ Approve
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDeleteFarmer(farmer.user_id)}
                                                                className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600">
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Products Tab */}
                    {activeTab === 'products' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                📦 সব Products
                            </h2>

                            {products.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-md p-10 text-center">
                                    <p className="text-gray-500">কোনো product নেই।</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-green-50">
                                            <tr>
                                                <th className="text-left px-4 py-3 text-gray-700">Product</th>
                                                <th className="text-left px-4 py-3 text-gray-700">Farmer</th>
                                                <th className="text-left px-4 py-3 text-gray-700">দাম</th>
                                                <th className="text-left px-4 py-3 text-gray-700">পরিমাণ</th>
                                                <th className="text-left px-4 py-3 text-gray-700">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => (
                                                <tr key={product.product_id}
                                                    className="border-t border-gray-100">
                                                    <td className="px-4 py-3 font-medium">
                                                        🌾 {product.name}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500">
                                                        👨‍🌾 {product.farmer_name}
                                                    </td>
                                                    <td className="px-4 py-3 text-green-600 font-medium">
                                                        ৳{product.price}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500">
                                                        {product.quantity} kg
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.product_id)}
                                                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600">
                                                            🗑️ Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;