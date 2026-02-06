import React from 'react';
import { getMemberActivity } from '@/lib/actions/report';
import Sidebar from '@/components/sideBar';
import Header from '@/components/header';

export const dynamic = 'force-dynamic';

export default async function MemberActivityReport() {
  const members = await getMemberActivity();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <main className="p-6 bg-gray-50 flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-shadow-navy mb-2">
              Actividad de Miembros
            </h1>
            <p className="text-armor-grey">
              Clasificación de usuarios por historial de cumplimiento
            </p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-shadow-navy text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Miembro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tipo</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase">Préstamos</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase">Tardíos</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase">Tasa Morosidad</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase">Estatus</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.member_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{member.member_type}</td>
                    <td className="px-6 py-4 text-center">{member.total_loans}</td>
                    <td className="px-6 py-4 text-center text-red-600 font-bold">{member.late_returns}</td>
                    <td className="px-6 py-4 text-center">{member.delinquency_rate}%</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border
                        ${member.member_status === 'Estrella' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                          member.member_status === 'Riesgoso' ? 'bg-red-100 text-red-700 border-red-200' :
                          'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {member.member_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}