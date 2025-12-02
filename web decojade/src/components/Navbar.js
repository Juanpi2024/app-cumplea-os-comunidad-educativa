'use client';

import Link from 'next/link';
import { useCart } from './CartContext';

export default function Navbar() {
    const { cartItems, setIsCartOpen } = useCart();
    const cartCount = cartItems.length;

    return (
        <nav className="bg-green-900 text-white p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                    <img src="/logo.jpg" alt="DecoJade JP Logo" className="w-12 h-12 rounded-full object-cover" />
                    DecoJade JP
                </Link>
                <div className="hidden md:flex gap-6 items-center">
                    <Link href="/" className="hover:text-green-200 transition-colors">Tienda</Link>
                    <Link href="/ideas" className="hover:text-green-200 transition-colors">Ideas</Link>
                    <Link href="/care" className="hover:text-green-200 transition-colors">Cuidados</Link>
                    <Link href="/about" className="hover:text-green-200 transition-colors">Nosotros</Link>
                    <Link href="/shipping" className="hover:text-green-200 transition-colors text-sm border border-green-700 px-3 py-1 rounded-full bg-green-800">Envíos</Link>
                </div>
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 hover:bg-green-800 rounded-full transition-colors"
                    aria-label="Open cart"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </nav>
    );
}
