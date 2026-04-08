'use client';
import React from 'react';
import { FileText, Download, BookOpen, Video, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';


// Backend integration point: fetch from /api/student/resources?studentId=current&limit=6
const resources = [
  { id: 'res-detox-guide', title: 'Detox Protocol Guide', type: 'PDF', module: 'Module 5', icon: FileText, color: 'text-red-500 bg-red-50' },
  { id: 'res-nutrition-chart', title: 'Healing Foods Chart', type: 'PDF', module: 'Module 5', icon: FileText, color: 'text-amber-600 bg-amber-50' },
  { id: 'res-sleep-workbook', title: 'Sleep Optimisation Workbook', type: 'Workbook', module: 'Module 3', icon: BookOpen, color: 'text-blue-500 bg-blue-50' },
  { id: 'res-movement-video', title: 'Morning Movement Sequence', type: 'Video', module: 'Module 4', icon: Video, color: 'text-purple-500 bg-purple-50' },
  { id: 'res-gut-protocol', title: 'Gut Healing 30-Day Plan', type: 'PDF', module: 'Module 2', icon: FileText, color: 'text-green-600 bg-green-50' },
];

export default function ResourceQuickAccess() {
  const handleDownload = (title: string) => {
    toast.success(`Downloading: ${title}`);
  };

  return (
    <div className="card-base overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-stone-100 flex items-center justify-between">
        <div>
          <p className="section-label mb-0.5">Resource Vault</p>
          <p className="text-xs font-sans text-stone-500">Your enrolled resources</p>
        </div>
        <button className="text-xs font-sans font-500 text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1">
          View all
          <ExternalLink size={11} />
        </button>
      </div>

      <div className="flex-1 divide-y divide-stone-100">
        {resources.map((res) => {
          const Icon = res.icon;
          return (
            <div key={res.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-stone-50 transition-colors group">
              <div className={`w-7 h-7 rounded-sm flex items-center justify-center shrink-0 ${res.color.split(' ')[1]}`}>
                <Icon size={13} className={res.color.split(' ')[0]} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-sans font-500 text-stone-700 truncate">{res.title}</p>
                <p className="text-2xs font-sans text-stone-400">{res.type} · {res.module}</p>
              </div>
              <button
                onClick={() => handleDownload(res.title)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-stone-400 hover:text-amber-700"
                title={`Download ${res.title}`}
              >
                <Download size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}