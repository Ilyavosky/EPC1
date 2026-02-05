import React from 'react';
import { getViralBooks } from '@/lib/actions/report';
import Sidebar from '@/components/sideBar';
import Header from '@/components/header';

export default async function ViralBooksReport() {
  const books = await getViralBooks();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 bg-gray-50 min-h-screen">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-shadow-navy mb-2">
              Libros Más Prestados
            </h1>
            <p className="text-armor-grey">
              Ranking de popularidad por categoría basado en historial de préstamos
            </p>
          </div>

          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-salamence-blue text-white p-4 rounded-lg">
                <p className="text-sm opacity-90">Total de Títulos</p>
                <p className="text-3xl font-bold">{books.length}</p>
              </div>
              <div className="bg-deep-crimson text-white p-4 rounded-lg">
                <p className="text-sm opacity-90">Más Prestado</p>
                <p className="text-xl font-bold truncate">
                  {books[0]?.title || 'N/A'}
                </p>
                <p className="text-sm opacity-90">
                  {books[0]?.total_loans} préstamos
                </p>
              </div>
              <div className="bg-shadow-navy text-white p-4 rounded-lg">
                <p className="text-sm opacity-90">Categorías</p>
                <p className="text-3xl font-bold">
                  {new Set(books.map(b => b.category_name)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-shadow-navy text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Ranking Global
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Rank Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Total Préstamos
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr key={book.book_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`
                            inline-flex items-center justify-center w-8 h-8 rounded-full font-bold
                            ${book.global_rank === 1 ? 'bg-yellow-400 text-yellow-900' : ''}
                            ${book.global_rank === 2 ? 'bg-gray-300 text-gray-700' : ''}
                            ${book.global_rank === 3 ? 'bg-orange-400 text-orange-900' : ''}
                            ${book.global_rank > 3 ? 'bg-gray-100 text-gray-600' : ''}
                          `}>
                            {book.global_rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-shadow-navy">
                          {book.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{book.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-salamence-blue text-white">
                          {book.category_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-medium text-gray-700">
                          #{book.category_rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-bold text-salamence-red">
                            {book.total_loans}
                          </div>
                          <div className="ml-2 flex-1">
                            <div className="bg-gray-200 rounded-full h-2 w-20">
                              <div
                                className="bg-salamence-red h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (book.total_loans / books[0].total_loans) * 100,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {books.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-armor-grey text-lg">
                No hay datos de préstamos disponibles
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}