'use client';
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { mockUsers } from '@/lib/data/mockData';
import type { User } from '@/lib/data/types';
import { Search, Edit2, Trash2, UserCheck, UserX } from 'lucide-react';

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<User[]>(
    mockUsers.filter(u => u.role === 'student')
  );

  const filtered = students.filter(s => {
    if (!search) return true;
    return (
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const toggleActive = (id: string) => {
    setStudents(prev =>
      prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s)
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Students</p>
          </div>
          <span className="text-xs font-sans text-stone-400 bg-stone-100 border border-stone-200 rounded-sm px-2.5 py-1">
            {filtered.length} student{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-6">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 placeholder-stone-400"
            />
          </div>
          <div className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  {['Name', 'Email', 'Phone', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm font-sans text-stone-400">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filtered.map(student => (
                    <tr key={student.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-sans font-medium text-stone-700">{student.fullName}</td>
                      <td className="px-5 py-3.5 font-sans text-stone-500">{student.email}</td>
                      <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">{student.phone || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-sans font-medium px-2 py-0.5 rounded-full border ${student.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                          {student.isActive ? <UserCheck size={11} /> : <UserX size={11} />}
                          {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">
                        {new Date(student.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleActive(student.id)}
                            className="text-stone-400 hover:text-amber-700 transition-colors"
                            title={student.isActive ? 'Deactivate' : 'Activate'}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button className="text-stone-400 hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
