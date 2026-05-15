const ProductCard = ({ product, onBuy, showBuyButton }) => {

    const categoryEmoji = {
        'সবজি': '🥦',
        'ফল': '🍎',
        'শস্য': '🌾',
        'মশলা': '🌶️',
        'অন্যান্য': '🌿',
    };

    const categoryBg = {
        'সবজি': '#f0fdf4, #d1fae5',
        'ফল': '#fff1f2, #ffedd5',
        'শস্য': '#fefce8, #fef3c7',
        'মশলা': '#fff7ed, #fee2e2',
        'অন্যান্য': '#f9fafb, #f3f4f6',
    };

    const emoji = categoryEmoji[product.category_name] || '🌾';
    const bg = categoryBg[product.category_name] || '#f0fdf4, #d1fae5';

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group cursor-pointer">
            
            {/* Top Color Bar */}
            <div className="h-1.5" style={{background: 'linear-gradient(to right, #4ade80, #34d399, #4ade80)'}}></div>

            {/* Product Image Area */}
            <div className="relative overflow-hidden"
                style={{background: `linear-gradient(to bottom right, ${bg})`, minHeight: '180px'}}>
                
                {product.image_url ? (
                    /* Real Image */
                    <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}

                {/* Emoji Fallback */}
                <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{display: product.image_url ? 'none' : 'flex'}}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <div className="w-32 h-32 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-7xl group-hover:scale-125 transition-transform duration-500 relative z-10">
                        {emoji}
                    </div>
                </div>

                {/* Category Badge */}
                {product.category_name && (
                    <span className="absolute top-3 right-3 bg-white text-green-700 text-xs px-2 py-1 rounded-full font-semibold shadow-sm">
                        {product.category_name}
                    </span>
                )}
            </div>

            {/* Product Info */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {product.name}
                </h3>
                
                <div className="flex items-end gap-1 mb-4">
                    <p className="text-3xl font-bold text-green-600">
                        ৳{product.price}
                    </p>
                    <span className="text-gray-400 text-sm mb-1">/kg</span>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <span>📦</span>
                        <span className="text-sm text-gray-600">
                            Available: <strong className="text-gray-800">{product.quantity} kg</strong>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <span>👨‍🌾</span>
                        <span className="text-sm text-gray-600">{product.farmer_name}</span>
                    </div>
                </div>

                {/* Buy Button */}
                {showBuyButton && (
                    <button
                        onClick={() => onBuy(product)}
                        style={{background: 'linear-gradient(to right, #22c55e, #10b981)'}}
                        className="w-full text-white py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 hover:opacity-90 shadow-lg">
                        🛒 Buy Now
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;