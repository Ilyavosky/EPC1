import React from 'react';
import { getInventoryHealth } from '@/lib/actions/report';
import Sidebar from '@/components/sideBar';
import Header from '@/components/header';

export const dynamic = 'force-dynamic';

export default async function InventoryReport() {
  const categories = await getInventoryHealth();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <main className="p-6 bg-gray-50 flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-shadow-navy mb-2">
              Salud del Inventario
            </h1>
            <p className="text-armor-grey">
              Disponibilidad y rotación de activos por categoría
            </p>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.category} className="bg-white rounded-lg shadow p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{cat.category}</h2>
                  <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium">
                    {cat.total_copies} copias totales
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Nivel de Ocupación</span>
                    <span className="font-bold text-salamence-blue">{cat.utilization_rate_pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        cat.utilization_rate_pct > 80 ? 'bg-red-500' : 'bg-salamence-blue'
                      }`}
                      style={{ width: `${cat.utilization_rate_pct}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                  <div>
                    <span className="block text-xs text-gray-400 uppercase">Disponibles</span>
                    <span className="text-lg font-bold text-green-600">{cat.in_shelf}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 uppercase">Prestados</span>
                    <span className="text-lg font-bold text-orange-500">{cat.checked_out}</span>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-400 truncate">
                  <span className="font-semibold">Muestra:</span> {cat.currently_borrowed_titles_sample}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}