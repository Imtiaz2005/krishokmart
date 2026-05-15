import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const FarmerDashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    // Form state
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [categoryId, setCategoryId] = useState('1');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    // Login check
    useEffect(() => {
        if (!user || user.role !== 'farmer') {
            navigate('/login');
        }
    }, [user]);

    // Products load
    const fetchMyProducts = async () => {
        try {
            const currentToken = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/products/my-products', {
                headers: { 'authorization': currentToken }
            });
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log('Error:', err);
        }
    };

    // Stats load
    const fetchStats = async () => {
        try {
            const currentToken = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/products/stats', {
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

    // Farmer Orders load
    const fetchFarmerOrders = async () => {
        try {
            const currentToken = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/orders/farmer-orders', {
                headers: { 'authorization': currentToken }
            });
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log('Error:', err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchMyProducts();
            fetchStats();
            fetchFarmerOrders();
        }
    }, [token]);

    // Product Add
    const handleAddProduct = async () => {
        setError('');
        setSuccess('');

        if (!name || !price || !quantity) {
            setError('সব field পূরণ করুন!');
            return;
        }

        try {
            const currentToken = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/products/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': currentToken
                },
                body: JSON.stringify({
                    name,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    category_id: parseInt(categoryId),
                    image_url: imageUrl || null
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message);
                return;
            }

            setSuccess('✅ Product সফলভাবে যোগ করা হয়েছে!');
            setName('');
            setPrice('');
            setQuantity('');
            setCategoryId('1');
            setImageUrl('');
            fetchMyProducts();
            fetchStats();

        } catch (err) {
            setError('Something went wrong!');
        }
    };

    // Product Delete
    const handleDelete = async (productId) => {
        if (!window.confirm('আপনি কি এই product টি delete করতে চান?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/products/delete/${productId}`, {
                method: 'DELETE',
                headers: { 'authorization': token }
            });

            if (res.ok) {
                fetchMyProducts();
                fetchStats();
            }
        } catch (err) {
            console.log('Error:', err);
        }
    };

    // Order Confirm
    const handleConfirmOrder = async (orderId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/orders/confirm/${orderId}`, {
                method: 'PUT',
                headers: { 'authorization': token }
            });

            const data = await res.json();

            if (res.ok) {
                alert('✅ Order confirmed!');
                fetchFarmerOrders();
                fetchStats();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.log('Error:', err);
        }
    };

    // Pending orders count
    const pendingCount = orders.filter(o => o.status === 'pending').length;

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
                            <div className="text-5xl mb-2">👨‍🌾</div>
                            <h2 className="font-bold text-gray-800">{user?.name}</h2>
                            <span className="text-green-600 text-sm">Farmer</span>
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
                                onClick={() => setActiveTab('orders')}
                                className={`text-left px-4 py-3 rounded-xl font-medium transition-colors flex justify-between items-center ${activeTab === 'orders'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}>
                                <span>📋 Orders</span>
                                {/* Pending badge */}
                                {pendingCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        {pendingCount}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('add')}
                                className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'add'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}>
                                ➕ Add Product
                            </button>
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'products'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}>
                                📦 My Products
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">

                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                📊 Dashboard
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                    <p className="text-4xl font-bold text-green-600">
                                        {stats.total_products || 0}
                                    </p>
                                    <p className="text-gray-500 mt-2">মোট Products</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center border-2 border-green-200">
                                    <p className="text-4xl font-bold text-green-600">
                                        ৳{parseFloat(stats.total_earnings || 0).toFixed(0)}
                                    </p>
                                    <p className="text-gray-500 mt-2">আমার আয় (90%)</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                    <p className="text-4xl font-bold text-green-600">
                                        ৳{parseFloat(stats.avg_price || 0).toFixed(0)}
                                    </p>
                                    <p className="text-gray-500 mt-2">গড় দাম</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                    <p className="text-4xl font-bold text-yellow-500">
                                        {pendingCount}
                                    </p>
                                    <p className="text-gray-500 mt-2">Pending Orders</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                                    <p className="text-4xl font-bold text-blue-500">
                                        {orders.filter(o => o.status === 'confirmed').length}
                                    </p>
                                    <p className="text-gray-500 mt-2">Confirmed Orders</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center border-2 border-red-100">
                                    <p className="text-4xl font-bold text-red-400">
                                        ৳{parseFloat(stats.total_platform_fee || 0).toFixed(0)}
                                    </p>
                                    <p className="text-gray-500 mt-2">Platform Fee (10%)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                📋 আমার কাছে আসা Orders
                            </h2>

                            {orders.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-md p-10 text-center">
                                    <p className="text-gray-500">😔 কোনো order নেই।</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {orders.map((order) => (
                                        <div key={order.order_id}
                                            className="bg-white rounded-2xl shadow-md p-4 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-gray-800">
                                                    🌾 {order.product_name}
                                                </h3>
                                                <p className="text-gray-500 text-sm">
                                                    👤 Buyer: {order.buyer_name} &nbsp;|&nbsp;
                                                    📦 {order.quantity} kg &nbsp;|&nbsp;
                                                    💰 ৳{order.total_price}
                                                </p>
                                                <p className="text-gray-400 text-xs mt-1">
                                                    🕐 {new Date(order.order_date).toLocaleDateString('bn-BD')}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {/* Status Badge */}
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : order.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {order.status === 'pending' ? '⏳ Pending' :
                                                        order.status === 'confirmed' ? '✅ Confirmed' :
                                                            order.status}
                                                </span>

                                                {/* Confirm Button */}
                                                {order.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleConfirmOrder(order.order_id)}
                                                        className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700 transition-colors">
                                                        ✅ Confirm
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Add Product Tab */}
                    {activeTab === 'add' && (
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                ➕ নতুন Product যোগ করুন
                            </h2>

                            {error && (
                                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4">
                                    ❌ {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-4">
                                    {success}
                                </div>
                            )}

                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-gray-700 font-medium mb-2 block">
                                        🌾 Product নাম
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="যেমন: Tomato, Rice"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 font-medium mb-2 block">
                                        💰 দাম (BDT/kg)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="যেমন: 30"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 font-medium mb-2 block">
                                        📦 পরিমাণ (kg)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="যেমন: 100"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 font-medium mb-2 block">
                                        📂 Category
                                    </label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-green-500 bg-white">
                                        <option value="1">🥦 সবজি</option>
                                        <option value="2">🍎 ফল</option>
                                        <option value="3">🌾 শস্য</option>
                                        <option value="4">🌶️ মশলা</option>
                                        <option value="5">🌿 অন্যান্য</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-medium mb-2 block">
                                        🖼️ Product Image URL (optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="যেমন: https://example.com/tomato.jpg"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                                    />
                                    {imageUrl && (
                                        <img
                                            src={imageUrl}
                                            alt="preview"
                                            className="mt-2 h-32 w-full object-cover rounded-xl"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    )}
                                </div>
                                <button
                                    onClick={handleAddProduct}
                                    className="bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
                                    ➕ Product যোগ করুন
                                </button>
                            </div>
                        </div>
                    )}

                    {/* My Products Tab */}
                    {activeTab === 'products' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                📦 আমার Products
                            </h2>

                            {products.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-md p-10 text-center">
                                    <p className="text-gray-500">
                                        😔 কোনো product নেই।
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {products.map((product) => (
                                        <div key={product.product_id}
                                            className="bg-white rounded-2xl shadow-md p-4 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-gray-800">
                                                    🌾 {product.name}
                                                </h3>
                                                <p className="text-gray-500 text-sm">
                                                    💰 {product.price} BDT/kg &nbsp;|&nbsp;
                                                    📦 {product.quantity} kg &nbsp;|&nbsp;
                                                    📂 {product.category_name}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(product.product_id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors">
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;