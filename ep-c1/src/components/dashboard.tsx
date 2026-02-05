import React from 'react';
import Link from 'next/link';

const Dashboard = () => {
  const reports = [
    {
      id: 1,
      title: 'Libros Más Prestados',
      description: 'Tabla de resultados de los libros más prestados'
    },
    {
      id: 2,
      title: 'Prestamos Vencidos',
      description: 'Tabla de resultados de los prestamos vencidos'
    },
    {
      id: 3,
      title: 'Finanzas',
      description: 'Tabla de resultados de cuánto dinero se ganó este mes y cuánto realmente se cobró'
    },
    {
      id: 4,
      title: 'Actividad de los miembros',
      description: 'Distinguir usuarios que si retornen los libros a tiempo, de los que no lo hacen'
    },
    {
      id: 5,
      title: 'Salud del Inventario',
      description: 'Tabla de resultados de eficiencia del inventario'
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-shadow-navy mb-2">Reportes Disponibles</h2>
        <p className="text-armor-grey">Selecciona un reporte para acceder a la View</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Link
            key={report.id}
            href={`/reports/${report.id}`}
            className="flex flex-col bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-armor-grey"
          >
            <div className="p-6 flex-1">
              <h3 className="text-xl font-semibold text-shadow-navy mb-2">
                {report.title}
              </h3>
              <p className="text-armor-grey text-sm">
                {report.description}
              </p>
            </div>
            <div className="px-6 py-3" style={{ backgroundColor: '#3C78A61A' }}>
              <span className="text-salamence-blue text-sm font-medium">
                Acceder a la view
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;