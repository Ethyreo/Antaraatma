import React from 'react';
import { Plus, Download, Filter } from 'lucide-react';

interface Props {
  onCreateProgram: () => void;
}

export default function ProgramManagementTopbar({ onCreateProgram }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 h-16 flex items-center px-6 xl:px-8 gap-4">
      <div className="flex-1">
        <p className="font-serif text-lg text-stone-900">Program Management</p>
        <p className="text-xs font-sans text-stone-500">Manage programs, modules, and lessons</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 text-xs font-sans font-500 text-stone-600 border border-stone-200 px-3 py-1.5 rounded-sm hover:bg-stone-50 transition-all">
          <Filter size={12} />
          Filter
        </button>
        <button className="flex items-center gap-1.5 text-xs font-sans font-500 text-stone-600 border border-stone-200 px-3 py-1.5 rounded-sm hover:bg-stone-50 transition-all">
          <Download size={12} />
          Export
        </button>
        <button
          onClick={onCreateProgram}
          className="flex items-center gap-1.5 bg-amber-800 text-amber-50 text-xs font-sans font-500 px-4 py-1.5 rounded-sm hover:bg-amber-900 transition-all active:scale-95"
        >
          <Plus size={13} />
          New Program
        </button>
      </div>
    </header>
  );
}