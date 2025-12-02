'use client';

import { useCart } from './CartContext';

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart } = useCart();
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
                <div className="p-4 border-b flex justify-between items-center bg-green-50">
                    <h2 className="text-xl font-bold text-green-900">Tu Carrito ({cartItems.length})</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">
                            <p>Tu carrito está vacío.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="mt-4 text-green-600 hover:underline"
                            >
                                Seguir comprando
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {cartItems.map((item, index) => (
                                <li key={`${item.id}-${index}`} className="flex gap-4 border-b pb-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://placehold.co/100x100?text=${encodeURIComponent(item.name)}`;
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.size}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="font-bold text-green-700">${item.price.toFixed(2)}</span>
                                            <button
                                                onClick={() => removeFromCart(index)}
                                                className="text-red-500 text-sm hover:text-red-700"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold text-green-900">${total.toFixed(2)}</span>
                    </div>
                    <button
                        className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={cartItems.length === 0}
                        onClick={() => alert('¡Compra simulada! Gracias por tu compra.')}
                    >
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </div>
    );
}
