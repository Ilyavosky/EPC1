import React from 'react';
import { getFinanceSummary } from '@/lib/actions/report';
import Sidebar from '@/components/sideBar';
import Header from '@/components/header';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function FinanceReport(props: PageProps) {
  const params = await props.searchParams;
  const startDate = params?.startDate || '';
  const endDate = params?.endDate || '';

  const finances = await getFinanceSummary({ startDate, endDate });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <main className="p-6 bg-gray-50 flex-1">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-bold text-shadow-navy mb-2">
                Resumen Financiero
              </h1>
              <p className="text-armor-grey">
                Recaudación de multas mensual
              </p>
            </div>

            <form className="flex gap-2 items-center bg-white p-2 rounded shadow-sm border">
              <input 
                type="month" 
                name="startDate"
                defaultValue={startDate}
                className="border rounded px-2 py-1 text-sm"
              />
              <span className="text-gray-400">-</span>
              <input 
                type="month" 
                name="endDate"
                defaultValue={endDate}
                className="border rounded px-2 py-1 text-sm"
              />
              <button 
                type="submit" 
                className="bg-salamence-blue text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Filtrar
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {finances.map((item) => (
              <div key={item.month_year} className="bg-white rounded-lg shadow p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-shadow-navy mb-4 border-b pb-2">
                  {item.month_year}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Generado</span>
                    <span className="font-bold text-gray-900">${item.total_amount_generated.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cobrado</span>
                    <span className="font-bold text-green-600">${item.total_collected.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deuda</span>
                    <span className="font-bold text-red-500">${item.outstanding_debt.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Tasa de Recuperación</span>
                    <span className="text-xs font-bold text-salamence-blue">{item.collection_rate_pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-salamence-blue h-2 rounded-full"
                      style={{ width: `${item.collection_rate_pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}