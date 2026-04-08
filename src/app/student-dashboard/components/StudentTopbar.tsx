import React from 'react';
import { Bell, Search } from 'lucide-react';

export default function StudentTopbar() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 h-16 flex items-center px-6 xl:px-8 gap-4">
      <div className="flex-1">
        <div>
          <p className="text-xs font-sans text-stone-500">Good morning,</p>
          <p className="font-serif text-lg text-stone-900 leading-tight">Priya Sharma</p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-sm px-3 py-2 w-52 xl:w-64">
        <Search size={13} className="text-stone-400 shrink-0" />
        <input
          type="text"
          placeholder="Search lessons, resources..."
          className="bg-transparent text-xs font-sans text-stone-600 placeholder:text-stone-400 outline-none flex-1"
        />
      </div>

      <button className="relative p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-sm transition-colors">
        <Bell size={18} />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-600" />
      </button>

      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
          <span className="font-serif text-sm text-amber-800">P</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-sans font-500 text-stone-800">Priya Sharma</p>
          <p className="text-2xs font-sans text-stone-500">Foundation Course</p>
        </div>
      </div>
    </header>
  );
}