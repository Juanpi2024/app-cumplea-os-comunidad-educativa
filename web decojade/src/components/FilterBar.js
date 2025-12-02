export default function FilterBar({ onSearch, onFilterSize, onSortPrice }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/3">
                <input
                    type="text"
                    placeholder="Buscar árboles de jade..."
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
                <select
                    onChange={(e) => onFilterSize(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">Todos los tamaños</option>
                    <option value="Pequeño">Pequeño</option>
                    <option value="Mediano">Mediano</option>
                    <option value="Grande">Grande</option>
                </select>

                <select
                    onChange={(e) => onSortPrice(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">Ordenar por precio</option>
                    <option value="asc">Menor a mayor</option>
                    <option value="desc">Mayor a menor</option>
                </select>
            </div>
        </div>
    );
}
