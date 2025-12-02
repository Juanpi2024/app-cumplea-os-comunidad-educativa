import Link from 'next/link';

export default function ProductCard({ product, onAddToCart }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-64 w-full bg-gray-200">
                {/* Using standard img for simplicity with placeholders, in production use next/image */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`;
                    }}
                />
            </div>
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-green-700 font-bold text-lg">${product.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.size}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.careInstructions}</p>
                <div className="flex gap-2">
                    <Link
                        href={`/product/${product.id}`}
                        className="flex-1 text-center border border-green-600 text-green-600 py-2 rounded hover:bg-green-50 transition-colors"
                    >
                        Detalles
                    </Link>
                    <button
                        onClick={() => onAddToCart(product)}
                        className="flex-1 bg-green-700 text-white py-2 rounded hover:bg-green-800 transition-colors"
                    >
                        Añadir al carrito
                    </button>
                </div>
            </div>
        </div>
    );
}
