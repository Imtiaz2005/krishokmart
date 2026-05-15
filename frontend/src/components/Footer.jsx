import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-16" id="contact">

            {/* About Section */}
            <div className="bg-green-800 py-16 px-4" id="about">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">
                            🌱 আমাদের সম্পর্কে
                        </h2>
                        <p className="text-green-200 leading-relaxed mb-4">
                            কৃষকমার্ট হলো বাংলাদেশের প্রথম সরাসরি কৃষক-ক্রেতা সংযোগ প্ল্যাটফর্ম। 
                            আমরা মধ্যস্থতাকারী ছাড়াই কৃষক ও ক্রেতার মধ্যে সেতুবন্ধন তৈরি করি।
                        </p>
                        <p className="text-green-200 leading-relaxed">
                            আমাদের লক্ষ্য হলো কৃষকদের ন্যায্য মূল্য নিশ্চিত করা এবং 
                            ক্রেতাদের কাছে তাজা ও মানসম্পন্ন পণ্য পৌঁছে দেওয়া।
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: '🌾', title: 'তাজা পণ্য', desc: 'সরাসরি খামার থেকে' },
                            { icon: '💰', title: 'সেরা দাম', desc: 'মধ্যস্থতাকারী নেই' },
                            { icon: '🚚', title: 'দ্রুত ডেলিভারি', desc: '২৪ ঘণ্টার মধ্যে' },
                            { icon: '🔒', title: 'নিরাপদ পেমেন্ট', desc: '১০০% সুরক্ষিত' },
                        ].map((item) => (
                            <div key={item.title} className="bg-green-700 rounded-xl p-4">
                                <div className="text-3xl mb-2">{item.icon}</div>
                                <h4 className="font-bold text-white">{item.title}</h4>
                                <p className="text-green-300 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-gray-800 py-12 px-4" id="help">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8">
                        ❓ সাহায্য কেন্দ্র
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                q: 'কীভাবে পণ্য কিনবো?',
                                a: 'Signup করুন Buyer হিসেবে, তারপর যেকোনো পণ্যে Buy Now চাপুন।'
                            },
                            {
                                q: 'কীভাবে পণ্য বিক্রি করবো?',
                                a: 'Farmer হিসেবে Signup করুন। Admin approval এর পর পণ্য add করতে পারবেন।'
                            },
                            {
                                q: 'Order cancel করবো কীভাবে?',
                                a: 'My Orders এ গিয়ে Pending order এর পাশে Cancel বাটন চাপুন।'
                            },
                        ].map((item) => (
                            <div key={item.q} className="bg-gray-700 rounded-xl p-5">
                                <h4 className="font-bold text-green-400 mb-2">
                                    ❓ {item.q}
                                </h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {/* Logo */}
                <div className="col-span-1 md:col-span-2">
                    <h2 className="text-2xl font-bold mb-3">🌱 কৃষকমার্ট</h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        সরাসরি কৃষকের কাছ থেকে তাজা ও সতেজ কৃষিপণ্য কিনুন।
                    </p>
                    <div className="flex gap-3 flex-wrap">
                        {['🌾 তাজা পণ্য', '🚚 দ্রুত ডেলিভারি', '💯 বিশ্বস্ত'].map((tag) => (
                            <span key={tag} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-bold text-lg mb-4 text-white">Quick Links</h3>
                    <ul className="flex flex-col gap-2">
                        {[
                            { to: '/', label: '🏠 Home' },
                            { to: '/login', label: '🔐 Login' },
                            { to: '/signup', label: '📝 Signup' },
                        ].map((link) => (
                            <li key={link.to}>
                                <Link to={link.to} 
                                    className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <a href="#about" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                                ℹ️ About
                            </a>
                        </li>
                        <li>
                            <a href="#help" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                                ❓ Help
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-bold text-lg mb-4 text-white">যোগাযোগ</h3>
                    <ul className="flex flex-col gap-3">
                        <li className="flex items-center gap-2 text-gray-400 text-sm">
                            <span>📧</span> info@কৃষকমার্ট.com
                        </li>
                        <li className="flex items-center gap-2 text-gray-400 text-sm">
                            <span>📞</span> +880 1700-000000
                        </li>
                        <li className="flex items-center gap-2 text-gray-400 text-sm">
                            <span>📍</span> ঢাকা, বাংলাদেশ
                        </li>
                    </ul>
                    <div className="flex gap-2 mt-4 flex-wrap">
                        {['সবজি', 'ফল', 'শস্য', 'মশলা'].map((cat) => (
                            <span key={cat} className="bg-green-900 text-green-400 text-xs px-2 py-1 rounded-full">
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[
                        { number: '৫০+', label: 'কৃষক' },
                        { number: '২০০+', label: 'পণ্য' },
                        { number: '১০০০+', label: 'ক্রেতা' },
                        { number: '৫০০০+', label: 'অর্ডার' },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <p className="text-2xl font-bold text-green-400">{stat.number}</p>
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-800 py-4 text-center">
                <p className="text-gray-500 text-sm">
                    © 2026 কৃষকমার্ট — সকল স্বত্ব সংরক্ষিত 🌱
                </p>
            </div>
        </footer>
    );
};

export default Footer;