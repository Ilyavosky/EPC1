import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-60 h-screen bg-shadow-navy text-white">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-8">Reportes de la BibliotecaUP</h1>
        
        <ul className="flex flex-col gap-2">
          <li>
            <Link 
              href="/" 
              className="block px-4 py-2 rounded hover:bg-deep-crimson transition-colors"
            >
              Dashboard
            </Link>
          </li>
          
          <li className="mt-4">
            <ul className="flex flex-col gap-1 mt-2">
              <li>
                <Link 
                  href="/reports/1" 
                  className="block px-4 py-2 rounded hover:bg-deep-crimson transition-colors"
                >
                  Libros Más Prestados
                </Link>
              </li>
              <li>
                <Link 
                  href="/reports/2" 
                  className="block px-4 py-2 rounded hover:bg-deep-crimson transition-colors"
                >
                  Prestamos Vencidos
                </Link>
              </li>
              <li>
                <Link 
                  href="/reports/3" 
                  className="block px-4 py-2 rounded hover:bg-deep-crimson transition-colors"
                >
                  Finanzas
                </Link>
              </li>
              <li>
                <Link 
                  href="/reports/4" 
                  className="block px-4 py-2 rounded hover:bg-deep-crimson transition-colors"
                >
                  Actividad de los miembros
                </Link>
              </li>
              <li>
                <Link 
                  href="/reports/5" 
                  className="block px-4 py-2 rounded hover:bg-deep-crimson transition-colors"
                >
                  Salud del Inventario
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;