import React from 'react';
import { getOverdueLoans } from '@/lib/actions/report';
import Sidebar from '@/components/sideBar';
import Header from '@/components/header';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    minDays?: string;
  }>;
}

export default async function OverdueReport(props: PageProps) {
  const params = await props.searchParams;
  const page = Number(params?.page) || 1;
  const minDays = Number(params?.minDays) || 0;
  const limit = 10;

  const loans = await getOverdueLoans({ page, limit, minDays });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <main className="p-6 bg-gray-50 flex-1">
          <div className="flex justify-between items-end mb-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 w-full max-w-2xl">
              <h1 className="text-2xl font-bold text-red-800 mb-1">Reporte de Morosidad</h1>
              <p className="text-red-600 text-sm">
                Préstamos con más de {minDays} días de retraso.
              </p>
            </div>

            <form className="flex items-center gap-2 bg-white p-2 rounded shadow-sm border">
              <span className="text-sm font-medium text-gray-600">Mínimo días:</span>
              <input 
                type="number" 
                name="minDays"
                defaultValue={minDays}
                min="0"
                className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-red-500 outline-none"
              />
              <button 
                type="submit" 
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                Filtrar
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-700 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Libro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Días Atraso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Riesgo</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase">Multa Est.</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map((loan) => (
                  <tr key={loan.loan_id} className="hover:bg-red-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{loan.member_name}</div>
                      <div className="text-xs text-gray-500">{loan.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 italic">{loan.book_title}</td>
                    <td className="px-6 py-4 text-center font-bold text-red-600 text-lg">
                      {loan.days_overdue}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold
                        ${loan.risk_level.includes('Alto') ? 'bg-red-200 text-red-900' : 
                          loan.risk_level.includes('Medio') ? 'bg-orange-200 text-orange-900' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {loan.risk_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-green-700">
                      ${loan.estimated_fine.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center">
            <Link
              href={`/reports/2?page=${Math.max(1, page - 1)}&minDays=${minDays}`}
              className={`px-4 py-2 border rounded bg-white ${page === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-100'}`}
            >
              Anterior
            </Link>
            <span className="text-sm text-gray-600">Página {page}</span>
            <Link
              href={`/reports/2?page=${page + 1}&minDays=${minDays}`}
              className={`px-4 py-2 border rounded bg-white ${loans.length < limit ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-100'}`}
            >
              Siguiente
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}