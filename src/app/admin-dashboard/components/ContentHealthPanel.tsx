'use client';
import React, { useEffect, useState } from 'react';
import { AlertTriangle, FileText, BookOpen, Layers, FolderOpen } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/ui/AppIcon';


interface ContentStat {
  id: string;
  label: string;
  count: number;
  published: number;
  drafts: number;
  issues: number;
  icon: React.ElementType;
}

export default function ContentHealthPanel() {
  const [contentItems, setContentItems] = useState<ContentStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchContentHealth() {
      try {
        const [
          { data: programs },
          { data: modules },
          { data: lessons },
          { data: resources },
        ] = await Promise.all([
          supabase.from('programs').select('status'),
          supabase.from('modules').select('status'),
          supabase.from('lessons').select('status'),
          supabase.from('resources').select('status'),
        ]);

        const buildStat = (
          id: string,
          label: string,
          rows: { status: string }[] | null,
          icon: React.ElementType
        ): ContentStat => {
          const all = rows ?? [];
          const published = all.filter((r) => r.status === 'published').length;
          const drafts = all.filter((r) => r.status === 'draft').length;
          const archived = all.filter((r) => r.status === 'archived').length;
          return { id, label, count: all.length, published, drafts, issues: archived, icon };
        };

        setContentItems([
          buildStat('ch-programs', 'Programs', programs, BookOpen),
          buildStat('ch-modules', 'Modules', modules, Layers),
          buildStat('ch-lessons', 'Lessons', lessons, FileText),
          buildStat('ch-resources', 'Resources', resources, FolderOpen),
        ]);
      } catch (err) {
        console.error('ContentHealth fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchContentHealth();
  }, []);

  return (
    <div className="card-base overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-stone-100">
        <p className="section-label mb-0.5">Content Health</p>
        <p className="text-xs font-sans text-stone-500">Platform content status</p>
      </div>

      <div className="p-5 grid grid-cols-2 gap-3 border-b border-stone-100">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-3 rounded-sm border border-stone-100 bg-stone-50 animate-pulse">
              <div className="h-3 bg-stone-200 rounded w-1/2 mb-2" />
              <div className="h-6 bg-stone-200 rounded w-1/3 mb-1" />
              <div className="h-2 bg-stone-100 rounded w-2/3" />
            </div>
          ))
        ) : (
          contentItems.map((item) => {
            const Icon = item.icon;
            const hasIssues = item.issues > 0;
            return (
              <div key={item.id} className={`p-3 rounded-sm border ${hasIssues ? 'border-orange-200 bg-orange-50/50' : 'border-stone-100 bg-stone-50'}`}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon size={12} className={hasIssues ? 'text-orange-600' : 'text-stone-500'} />
                  <span className="text-2xs font-sans font-600 uppercase tracking-wide text-stone-500">{item.label}</span>
                </div>
                <p className="font-serif text-xl text-stone-900 tabular-nums">{item.count}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xs font-sans text-green-600">{item.published} live</span>
                  {item.drafts > 0 && <span className="text-2xs font-sans text-stone-400">{item.drafts} draft</span>}
                  {item.issues > 0 && (
                    <span className="text-2xs font-sans text-orange-600 flex items-center gap-0.5">
                      <AlertTriangle size={9} />
                      {item.issues} archived
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex-1 flex items-center justify-center p-5">
        <p className="text-xs font-sans text-stone-400 text-center">Content activity log coming soon.</p>
      </div>
    </div>
  );
}