import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const BuyerPage = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products');
    const [buyQuantity, setBuyQuantity] = useState({});

    // Login check
    useEffect(() => {
        if (!user || user.role !== 'buyer') {
            navigate('/login');
        }
    }, [user]);

    // Products load করো
    const fetchProducts = async () => {
    setLoading(true);
    try {
        let url = `http://localhost:5000/api/products/search?name=${search}&sort=${sort}&category_id=${category}`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
        console.log('Error:', err);
        setProducts([]);
    } finally {
        setLoading(false);
    }
};

    // Orders load করো
    const fetchOrders = async () => {
    try {
        const currentToken = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/orders/my-orders', {
            headers: { 
                'authorization': currentToken
            }
        });

        if (!res.ok) {
            console.log('Orders fetch failed:', res.status);
            setOrders([]);
            return;
        }

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
        console.log('Error:', err);
        setOrders([]);
    }
};
    // Order Cancel করো
    const handleCancel = async (orderId) => {
    if (!window.confirm('আপনি কি এই order টি cancel করতে চান?')) return;

    try {
        const currentToken = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/orders/cancel/${orderId}`, {
            method: 'PUT',
            headers: { 'authorization': currentToken }
        });

        const data = await res.json();

        if (res.ok) {
            alert('✅ Order cancelled!');
            fetchOrders();
            fetchProducts();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Something went wrong!');
    }
};
    useEffect(() => {
        if (token) {
            fetchProducts();
            fetchOrders();
        }
    }, [token]);

    // Buy করো
    const handleBuy = async (product) => {
    const qty = buyQuantity[product.product_id] || 1;

    if (qty > product.quantity) {
        alert(`❌ শুধু ${product.quantity}kg available!`);
        return;
    }

    try {
        const currentToken = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/orders/place', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': currentToken
            },
            body: JSON.stringify({
                product_id: product.product_id,
                quantity: parseInt(qty)
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        alert(`✅ Order সফল! মোট: ৳${data.total_price}`);
        fetchProducts();
        fetchOrders();

    } catch (err) {
        alert('Something went wrong!');
    }
};

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">

                {/* Sidebar */}
                <div className="w-64 shrink-0">
                    <div className="bg-white rounded-2xl shadow-md p-4">
                        <div className="text-center mb-6">
                            <div className="text-5xl mb-2">🛒</div>
                            <h2 className="font-bold text-gray-800">{user?.name}</h2>
                            <span className="text-green-600 text-sm">Buyer</span>
                        </div>

                        <nav className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'products'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}>
                                🌾 Products
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}>
                                📋 My Orders
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">

                    {/* Products Tab */}
                    {activeTab === 'products' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                🌾 সব Products
                            </h2>

                            {/* Search + Filter */}
                            <div className="flex gap-3 mb-6 flex-wrap">
                                <input
                                    type="text"
                                    placeholder="🔍 পণ্য খুঁজুন..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-green-500"
                                />
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="border border-gray-300 rounded-xl px-4 py-2 outline-none">
                                    <option value="">💰 Price Sort</option>
                                    <option value="low">Low to High</option>
                                    <option value="high">High to Low</option>
                                </select>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="border border-gray-300 rounded-xl px-4 py-2 outline-none">
                                    <option value="">📦 All Categories</option>
                                    <option value="1">সবজি</option>
                                    <option value="2">ফল</option>
                                    <option value="3">শস্য</option>
                                    <option value="4">মশলা</option>
                                    <option value="5">অন্যান্য</option>
                                </select>
                                <button
                                    onClick={fetchProducts}
                                    className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700">
                                    Filter
                                </button>
                            </div>

                            {/* Products Grid */}
                            {loading ? (
                                <p className="text-gray-500">⏳ Loading...</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <div key={product.product_id}
                                            className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3">
                                            <div className="bg-green-50 rounded-xl p-4 text-center text-4xl">
                                                🌾
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-lg">
                                                {product.name}
                                            </h3>
                                            <p className="text-green-600 font-semibold">
                                                💰 {product.price} BDT/kg
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                📦 Available: {product.quantity} kg
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                👨‍🌾 {product.farmer_name}
                                            </p>

                                            {/* Quantity Input */}
                                            <div className="flex items-center gap-2">
                                                <label className="text-gray-600 text-sm">
                                                    পরিমাণ (kg):
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={product.quantity}
                                                    value={buyQuantity[product.product_id] || 1}
                                                    onChange={(e) => setBuyQuantity({
                                                        ...buyQuantity,
                                                        [product.product_id]: e.target.value
                                                    })}
                                                    className="w-20 border border-gray-300 rounded-lg px-2 py-1 outline-none text-center"
                                                />
                                            </div>

                                            {/* Buy Button */}
                                            <button
                                                onClick={() => handleBuy(product)}
                                                className="bg-green-600 text-white py-2 rounded-xl font-medium hover:bg-green-700 transition-colors">
                                                🛒 Buy Now
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                📋 আমার Orders
                            </h2>

                            {orders.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-md p-10 text-center">
                                    <p className="text-gray-500">
                                        😔 কোনো order নেই।
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {orders.map((order) => (
                                        <div key={order.order_id}
                                            className="bg-white rounded-2xl shadow-md p-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-bold text-gray-800">
                                                        🌾 {order.product_name}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm">
                                                        📦 {order.quantity} kg &nbsp;|&nbsp;
                                                        👨‍🌾 {order.farmer_name}
                                                    </p>
                                                    <p className="text-gray-400 text-xs mt-1">
                                                        🕐 {new Date(order.order_date).toLocaleDateString('bn-BD')}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {/* Total Price */}
                                                    <p className="text-green-600 font-bold text-lg">
                                                        ৳{order.total_price}
                                                    </p>

                                                    {/* Status Badge */}
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : order.status === 'confirmed'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {order.status === 'pending' ? '⏳ Pending' :
                                                            order.status === 'confirmed' ? '✅ Confirmed' :
                                                                '❌ Cancelled'}
                                                    </span>

                                                    {/* Cancel Button */}
                                                    {order.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleCancel(order.order_id)}
                                                            className="bg-red-500 text-white px-3 py-1 rounded-xl text-sm hover:bg-red-600 transition-colors">
                                                            ❌ Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
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

export default BuyerPage;