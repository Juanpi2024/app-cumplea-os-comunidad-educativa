'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/FilterBar';
import productsData from '../data/products.json';
import { useCart } from '@/components/CartContext';

export default function Home() {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [priceSort, setPriceSort] = useState('');

  const filteredProducts = useMemo(() => {
    let result = productsData.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (sizeFilter === '' || product.size === sizeFilter)
    );

    if (priceSort === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, sizeFilter, priceSort]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">Colección DecoJade</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre la belleza y resistencia de la Crassula ovata. Trae la naturaleza a tu hogar con nuestra selección curada de árboles de jade.
          </p>
        </header>

        <FilterBar
          onSearch={setSearchQuery}
          onFilterSize={setSizeFilter}
          onSortPrice={setPriceSort}
        />

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No se encontraron productos que coincidan con tus criterios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}

        {/* Testimonios */}
        <section className="mt-20 bg-white rounded-xl shadow-sm p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-green-900 mb-12">Lo que dicen nuestros clientes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                <img src="https://placehold.co/100x100?text=Ana" alt="Cliente Ana" className="w-full h-full object-cover" />
              </div>
              <p className="text-gray-600 italic mb-4">"Mi Jade llegó en perfectas condiciones. El embalaje es increíble, se nota el cariño. ¡Gracias DecoJade!"</p>
              <p className="font-bold text-green-800">- Ana M.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                <img src="https://placehold.co/100x100?text=Carlos" alt="Cliente Carlos" className="w-full h-full object-cover" />
              </div>
              <p className="text-gray-600 italic mb-4">"Seguí los consejos de Feng Shui de su blog y puse mi Jade en la entrada. ¡Se ve espectacular!"</p>
              <p className="font-bold text-green-800">- Carlos R.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                <img src="https://placehold.co/100x100?text=Sofia" alt="Cliente Sofia" className="w-full h-full object-cover" />
              </div>
              <p className="text-gray-600 italic mb-4">"La calidad de la planta es superior a lo que he visto en viveros locales. Muy recomendados."</p>
              <p className="font-bold text-green-800">- Sofía L.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-green-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 DecoJade JP. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
