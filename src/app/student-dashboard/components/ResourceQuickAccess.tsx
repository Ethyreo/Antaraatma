'use client';
import React, { useEffect, useState } from 'react';
import { FileText, Download, BookOpen, Video, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/ui/AppIcon';


interface ResourceItem {
  id: string;
  title: string;
  resource_type: string;
  file_url: string;
  program_id: string | null;
}

const typeIconMap: Record<string, { icon: React.ElementType; color: string }> = {
  pdf: { icon: FileText, color: 'text-red-500 bg-red-50' },
  ebook: { icon: BookOpen, color: 'text-amber-600 bg-amber-50' },
  worksheet: { icon: BookOpen, color: 'text-blue-500 bg-blue-50' },
  video: { icon: Video, color: 'text-purple-500 bg-purple-50' },
  audio: { icon: FileText, color: 'text-green-600 bg-green-50' },
  guide: { icon: FileText, color: 'text-orange-500 bg-orange-50' },
};

export default function ResourceQuickAccess() {
  const { user } = useAuth();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    async function fetchResources() {
      try {
        // Get enrolled program IDs
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('program_id')
          .eq('user_id', user.id)
          .eq('enrollment_status', 'active');

        const programIds = enrollments?.map((e) => e.program_id) ?? [];

        if (programIds.length === 0) {
          // Show free resources
          const { data } = await supabase
            .from('resources')
            .select('id, title, resource_type, file_url, program_id')
            .eq('status', 'published')
            .eq('access_level', 'free')
            .order('sort_order', { ascending: true })
            .limit(6);
          setResources(data ?? []);
        } else {
          const { data } = await supabase
            .from('resources')
            .select('id, title, resource_type, file_url, program_id')
            .eq('status', 'published')
            .in('program_id', programIds)
            .order('sort_order', { ascending: true })
            .limit(6);
          setResources(data ?? []);
        }
      } catch (err) {
        console.error('Resources fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [user]);

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
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
              <div className="w-7 h-7 rounded-sm bg-stone-200 shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-stone-200 rounded w-3/4" />
                <div className="h-2 bg-stone-100 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : resources.length === 0 ? (
          <div className="px-5 py-6 text-center">
            <p className="text-xs font-sans text-stone-400">No resources available yet.</p>
          </div>
        ) : (
          resources.map((res) => {
            const typeConf = typeIconMap[res.resource_type] ?? typeIconMap.pdf;
            const Icon = typeConf.icon;
            const [iconColor, bgColor] = typeConf.color.split(' ');
            return (
              <div key={res.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-stone-50 transition-colors group">
                <div className={`w-7 h-7 rounded-sm flex items-center justify-center shrink-0 ${bgColor}`}>
                  <Icon size={13} className={iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-sans font-500 text-stone-700 truncate">{res.title}</p>
                  <p className="text-2xs font-sans text-stone-400 capitalize">{res.resource_type}</p>
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
          })
        )}
      </div>
    </div>
  );
}