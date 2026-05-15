import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, []);
    return (
       <nav className={`sticky top-0 z-50 transition-all duration-300 ${
    scrolled 
        ? 'bg-white shadow-lg border-b border-gray-100' 
        : 'bg-white/95 backdrop-blur-sm shadow-sm'
}`}>            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-2xl">🌱</span>
                    <span className="text-xl font-bold text-green-600">কৃষকমার্ট
</span>
                </Link>

                {/* Menu */}
                <div className="flex items-center gap-1">
                    <Link 
                        to="/" 
                        className={`font-medium px-3 py-2 rounded-lg transition-colors text-sm ${
                            isActive('/') 
                                ? 'text-green-600 bg-green-50' 
                                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                        }`}>
                        Home
                    </Link>

                    {/* Public Links */}
                    {!user && (
                        <>
                            <a href="#about"
                                className="text-gray-600 hover:text-green-600 font-medium px-3 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm">
                                About
                            </a>
                            <a href="#contact"
                                className="text-gray-600 hover:text-green-600 font-medium px-3 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm">
                                Contact
                            </a>
                            <a href="#help"
                                className="text-gray-600 hover:text-green-600 font-medium px-3 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm">
                                Help
                            </a>
                        </>
                    )}

                    {!user && (
                        <>
                            <div className="w-px h-5 bg-gray-200 mx-1"></div>
                            <Link 
                                to="/login" 
                                className="text-gray-600 hover:text-green-600 font-medium px-3 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm">
                                Login
                            </Link>
                            <Link 
                                to="/signup" 
                                className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors text-sm shadow-md shadow-green-200">
                                Signup
                            </Link>
                        </>
                    )}

                    {user?.role === 'farmer' && (
                        <Link 
                            to="/farmer" 
                            className={`font-medium px-3 py-2 rounded-lg transition-colors text-sm ${
                                isActive('/farmer')
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                            }`}>
                            Dashboard
                        </Link>
                    )}

                    {user?.role === 'buyer' && (
                        <Link 
                            to="/buyer" 
                            className={`font-medium px-3 py-2 rounded-lg transition-colors text-sm ${
                                isActive('/buyer')
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                            }`}>
                            Products
                        </Link>
                    )}

                    {user?.role === 'admin' && (
                        <Link 
                            to="/admin" 
                            className={`font-medium px-3 py-2 rounded-lg transition-colors text-sm ${
                                isActive('/admin')
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                            }`}>
                            Admin Panel
                        </Link>
                    )}

                    {user && (
                        <div className="flex items-center gap-2 ml-2">
                            <div 
    onClick={() => navigate('/profile')}
    className="bg-green-50 border border-green-100 px-3 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-green-100 transition-colors">
    <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
        {user.name.charAt(0).toUpperCase()}
    </div>
    <span className="text-green-700 font-medium text-sm">
        {user.name}
    </span>
</div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-50 text-red-500 border border-red-100 px-3 py-2 rounded-xl font-medium hover:bg-red-100 transition-colors text-sm">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;