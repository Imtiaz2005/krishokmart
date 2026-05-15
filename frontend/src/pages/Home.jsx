import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="relative text-white py-24 px-4 overflow-hidden"
                style={{background: 'linear-gradient(135deg, #16a34a, #22c55e, #34d399)'}}>

                {/* Background circles */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>

                {/* Floating Items */}
                <div className="absolute top-10 left-10 text-5xl opacity-20 animate-bounce">🌾</div>
                <div className="absolute top-20 right-20 text-4xl opacity-20" style={{animation: 'float 3s ease-in-out infinite'}}>🍅</div>
                <div className="absolute bottom-10 left-20 text-4xl opacity-20" style={{animation: 'float 4s ease-in-out infinite'}}>🥦</div>
                <div className="absolute bottom-20 right-10 text-5xl opacity-20" style={{animation: 'float 5s ease-in-out infinite'}}>🍎</div>
                <div className="absolute top-1/2 left-5 text-3xl opacity-20" style={{animation: 'float 3.5s ease-in-out infinite'}}>🌽</div>
                <div className="absolute top-1/3 right-5 text-3xl opacity-20" style={{animation: 'float 4.5s ease-in-out infinite'}}>🥕</div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-block bg-yellow-400 text-green-800 px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
                        🌾 বাংলাদেশের সেরা কৃষি বাজার
                    </div>
                    <h1 className="text-5xl font-bold mb-4 leading-tight"
                        style={{animation: 'fadeInUp 0.8s ease forwards'}}>
                        তাজা পণ্য, সরাসরি
                        <span className="block text-yellow-300"
                            style={{animation: 'fadeInUp 1s ease forwards'}}>
                            কৃষকের কাছ থেকে
                        </span>
                    </h1>
                    <p className="text-green-100 text-lg mb-10 max-w-2xl mx-auto">
                        মধ্যস্থতাকারী ছাড়াই সরাসরি কৃষকের কাছ থেকে তাজা শাকসবজি,
                        ফলমূল ও শস্য কিনুন। সেরা দামে, সেরা মান।
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="flex gap-3 bg-white rounded-2xl p-2 shadow-xl">
                            <div className="flex items-center flex-1 gap-2 px-3">
                                <span className="text-gray-400 text-xl">🔍</span>
                                <input
                                    type="text"
                                    placeholder="কী খুঁজছেন? যেমন: Tomato, Rice, Mango..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                                    className="flex-1 py-2 outline-none text-gray-800 placeholder-gray-400"
                                />
                            </div>
                            <button
                                onClick={fetchProducts}
                                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
                                Search
                            </button>
                        </div>

                        {/* Quick Categories */}
                        <div className="flex gap-2 mt-4 justify-center flex-wrap">
                            {[
                                { id: '', name: '🌿 সব পণ্য' },
                                { id: '1', name: '🥦 সবজি' },
                                { id: '2', name: '🍎 ফল' },
                                { id: '3', name: '🌾 শস্য' },
                                { id: '4', name: '🌶️ মশলা' },
                                { id: '5', name: '🌿 অন্যান্য' },
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setCategory(cat.id);
                                        setTimeout(fetchProducts, 100);
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        category === cat.id
                                            ? 'bg-white text-green-600 shadow-md'
                                            : 'bg-green-700 text-white hover:bg-green-800'
                                    }`}>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[
                        { number: '৫০+', label: 'কৃষক', icon: '👨‍🌾' },
                        { number: '২০০+', label: 'পণ্য', icon: '🌾' },
                        { number: '১০০০+', label: 'ক্রেতা', icon: '🛒' },
                        { number: '৫০০০+', label: 'অর্ডার', icon: '📦' },
                    ].map((stat) => (
                        <div key={stat.label} className="py-2">
                            <p className="text-2xl mb-1">{stat.icon}</p>
                            <p className="text-2xl font-bold text-green-600">{stat.number}</p>
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter + Products Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            🌾 সব পণ্য
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {products.length} টি পণ্য পাওয়া গেছে
                        </p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        {/* Sort */}
                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                                setTimeout(fetchProducts, 100);
                            }}
                            className="border border-gray-200 rounded-xl px-4 py-2 outline-none text-gray-700 bg-white shadow-sm">
                            <option value="">💰 Price Sort</option>
                            <option value="low">কম দাম আগে</option>
                            <option value="high">বেশি দাম আগে</option>
                        </select>

                        {/* Category Filter */}
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setTimeout(fetchProducts, 100);
                            }}
                            className="border border-gray-200 rounded-xl px-4 py-2 outline-none text-gray-700 bg-white shadow-sm">
                            <option value="">📦 All Categories</option>
                            <option value="1">🥦 সবজি</option>
                            <option value="2">🍎 ফল</option>
                            <option value="3">🌾 শস্য</option>
                            <option value="4">🌶️ মশলা</option>
                            <option value="5">🌿 অন্যান্য</option>
                        </select>

                        {/* Reset */}
                        <button
                            onClick={() => {
                                setSearch('');
                                setSort('');
                                setCategory('');
                                setTimeout(fetchProducts, 100);
                            }}
                            className="border border-gray-200 bg-white text-gray-600 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50">
                            🔄 Reset
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
                                <div className="bg-gray-200 rounded-xl h-32 mb-4"></div>
                                <div className="bg-gray-200 rounded h-4 mb-2"></div>
                                <div className="bg-gray-200 rounded h-4 w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-6xl mb-4">😔</p>
                        <p className="text-gray-500 text-lg">কোনো পণ্য পাওয়া যায়নি</p>
                        <button
                            onClick={() => {
                                setSearch('');
                                setSort('');
                                setCategory('');
                                setTimeout(fetchProducts, 100);
                            }}
                            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700">
                            সব পণ্য দেখুন
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.product_id}
                                product={product}
                                showBuyButton={false}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Feature Section */}
            <div className="bg-green-50 py-16 px-4 mt-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                        কেন কৃষকমার্ট? 🌱
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '🌾',
                                title: 'সরাসরি কৃষক থেকে',
                                desc: 'মধ্যস্থতাকারী ছাড়াই সরাসরি কৃষকের কাছ থেকে পণ্য কিনুন।'
                            },
                            {
                                icon: '💰',
                                title: 'সেরা দাম',
                                desc: 'বাজারের চেয়ে কম দামে তাজা ও মানসম্পন্ন পণ্য পান।'
                            },
                            {
                                icon: '🚚',
                                title: 'দ্রুত ডেলিভারি',
                                desc: 'অর্ডার দিন এবং দ্রুততম সময়ে পণ্য পান আপনার দরজায়।'
                            },
                        ].map((feature) => (
                            <div key={feature.title}
                                className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Home;