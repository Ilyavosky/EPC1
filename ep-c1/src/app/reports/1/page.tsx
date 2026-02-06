import React from 'react';
import { getViralBooks } from '@/lib/actions/report';
import Sidebar from '@/components/sideBar';
import Header from '@/components/header';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function ViralBooksReport(props: PageProps) {
  const params = await props.searchParams;
  const page = Number(params?.page) || 1;
  const search = params?.search || '';
  const limit = 10;

  const books = await getViralBooks({ page, limit, search });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <main className="p-6 bg-gray-50 flex-1">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-bold text-shadow-navy mb-2">
                Libros Más Prestados
              </h1>
              <p className="text-armor-grey">
                Ranking de popularidad por categoría
              </p>
            </div>
            
            <form className="flex gap-2">
              <input 
                name="search"
                defaultValue={search}
                placeholder="Buscar título o autor..." 
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-salamence-blue outline-none"
              />
              <button 
                type="submit" 
                className="bg-salamence-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Buscar
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-shadow-navy text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Ranking</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Autor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Préstamos</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr key={book.book_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-900">#{book.global_rank}</td>
                      <td className="px-6 py-4 font-medium text-shadow-navy">{book.title}</td>
                      <td className="px-6 py-4 text-gray-600">{book.author}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {book.category_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-salamence-red font-bold">{book.total_loans}</td>
                    </tr>
                  ))}
                  {books.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No se encontraron datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Link
              href={`/reports/1?page=${Math.max(1, page - 1)}&search=${search}`}
              className={`px-4 py-2 border rounded bg-white ${page === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-100'}`}
            >
              Anterior
            </Link>
            <span className="text-sm text-gray-600">Página {page}</span>
            <Link
              href={`/reports/1?page=${page + 1}&search=${search}`}
              className={`px-4 py-2 border rounded bg-white ${books.length < limit ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-100'}`}
            >
              Siguiente
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}