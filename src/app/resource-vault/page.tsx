'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Download,
  Lock,
  BookOpen,
  Headphones,
  Video,
  FileText,
} from 'lucide-react';
import StudentSidebar from '@/components/StudentSidebar';
import { createClient } from '@/lib/supabase/client';
import type { ResourceType } from '@/lib/data/types';

interface ResourceRecord {
  id: string;
  title: string;
  description: string;
  resource_type: ResourceType;
  file_url: string;
  access_level: string;
  program_id: string | null;
  program_title: string | null;
  featured: boolean;
  is_accessible: boolean;
}

const typeIcons: Record<ResourceType, React.ReactNode> = {
  ebook: <BookOpen size={16} />,
  pdf: <FileText size={16} />,
  audio: <Headphones size={16} />,
  video: <Video size={16} />,
  guide: <FileText size={16} />,
  worksheet: <FileText size={16} />,
};

const resourceTypes: ResourceType[] = [
  'ebook',
  'pdf',
  'audio',
  'video',
  'guide',
  'worksheet',
];

export default function ResourceVaultPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [resources, setResources] = useState<ResourceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeProgram, setActiveProgram] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function loadResourceVault() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/sign-up-login?redirectTo=/resource-vault');
        if (isMounted) {
          setAuthChecked(true);
        }
        return;
      }

      if (isMounted) {
        setAuthed(true);
        setAuthChecked(true);
      }

      try {
        const response = await fetch('/api/resources');
        const json = await response.json();

        if (!response.ok || json.error) {
          throw new Error(json.error || 'Failed to load resources.');
        }

        if (isMounted) {
          setResources(json.data ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load resources.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadResourceVault();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const accessibleResources = useMemo(
    () => resources.filter((resource) => resource.is_accessible),
    [resources]
  );
  const lockedResources = useMemo(
    () => resources.filter((resource) => !resource.is_accessible),
    [resources]
  );
  const featuredResources = useMemo(
    () => accessibleResources.filter((resource) => resource.featured),
    [accessibleResources]
  );

  const filteredResources = useMemo(() => {
    return accessibleResources.filter((resource) => {
      const normalizedSearch = search.trim().toLowerCase();
      const matchSearch =
        !normalizedSearch ||
        resource.title.toLowerCase().includes(normalizedSearch) ||
        resource.description.toLowerCase().includes(normalizedSearch);
      const matchType = !activeType || resource.resource_type === activeType;
      const matchProgram = !activeProgram || resource.program_id === activeProgram;
      return matchSearch && matchType && matchProgram;
    });
  }, [accessibleResources, search, activeType, activeProgram]);

  const programs = useMemo(() => {
    const uniquePrograms = new Map<string, string>();

    resources.forEach((resource) => {
      if (resource.program_id && resource.program_title) {
        uniquePrograms.set(resource.program_id, resource.program_title);
      }
    });

    return Array.from(uniquePrograms.entries()).map(([id, title]) => ({ id, title }));
  }, [resources]);

  const handleOpenResource = (resource: ResourceRecord) => {
    if (!resource.file_url) {
      return;
    }

    window.open(resource.file_url, '_blank', 'noopener,noreferrer');
  };

  if (!authChecked || !authed) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#F4EFE6' }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: '#1A6B6B', borderTopColor: 'transparent' }}
          />
          <p className="text-sm font-sans text-stone-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#F4EFE6' }}>
      <StudentSidebar />
      <div className="flex-1 min-w-0">
        <div
          className="sticky top-0 z-30 backdrop-blur-sm px-6 xl:px-8 h-16 flex items-center"
          style={{ background: 'rgba(244,239,230,0.96)', borderBottom: '1px solid rgba(168,216,206,0.3)' }}
        >
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Learning</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Resource Vault</p>
          </div>
        </div>

        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-8">
          <div className="max-w-2xl">
            <h1 className="font-serif text-display-md text-stone-900 mb-4">Your healing library.</h1>
            <p className="text-base font-sans font-light text-stone-500 leading-relaxed">
              All resources unlocked by your enrollments - ebooks, audio guides,
              worksheets, and video content - curated for each stage of your journey.
            </p>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white border border-stone-200/80 rounded-sm p-5 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-sm bg-stone-100 mb-4" />
                  <div className="h-4 w-2/3 rounded bg-stone-100 mb-2" />
                  <div className="h-3 rounded bg-stone-100 mb-2" />
                  <div className="h-3 w-4/5 rounded bg-stone-100" />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div
              className="bg-white border border-stone-200/80 rounded-sm p-6"
            >
              <h2 className="font-serif text-xl text-stone-800 mb-2">Resources are temporarily unavailable.</h2>
              <p className="text-sm font-sans text-stone-500">{error}</p>
            </div>
          )}

          {!loading && !error && featuredResources.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-amber-700/40" />
                <h2 className="font-serif text-xl text-stone-800">Featured Resources</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white border border-amber-200/60 rounded-sm p-6 group hover:shadow-card-hover transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                        {typeIcons[resource.resource_type]}
                      </div>
                      <span className="text-2xs font-sans font-medium text-amber-700 uppercase tracking-widest capitalize">
                        {resource.resource_type}
                      </span>
                    </div>
                    <h3 className="font-serif text-base text-stone-800 mb-2">{resource.title}</h3>
                    <p className="text-xs font-sans font-light text-stone-500 leading-relaxed mb-5">
                      {resource.description}
                    </p>
                    <button
                      onClick={() => handleOpenResource(resource)}
                      className="inline-flex items-center gap-2 text-xs font-sans font-medium text-amber-800 hover:text-amber-900 transition-colors"
                    >
                      <Download size={13} />
                      Open Resource
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-3">
              <div className="relative max-w-md">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="input-base pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveType(null)}
                  className={`text-xs font-sans font-medium px-3 py-1.5 rounded-sm border transition-colors ${
                    !activeType
                      ? 'bg-amber-800 text-amber-50 border-amber-800'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'
                  }`}
                >
                  All Types
                </button>
                {resourceTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(activeType === type ? null : type)}
                    className={`text-xs font-sans font-medium px-3 py-1.5 rounded-sm border transition-colors capitalize ${
                      activeType === type
                        ? 'bg-amber-800 text-amber-50 border-amber-800'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveProgram(null)}
                  className={`text-xs font-sans font-medium px-3 py-1.5 rounded-sm border transition-colors ${
                    !activeProgram
                      ? 'bg-stone-800 text-stone-100 border-stone-800'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  All Programs
                </button>
                {programs.map((program) => (
                  <button
                    key={program.id}
                    onClick={() => setActiveProgram(activeProgram === program.id ? null : program.id)}
                    className={`text-xs font-sans font-medium px-3 py-1.5 rounded-sm border transition-colors ${
                      activeProgram === program.id
                        ? 'bg-stone-800 text-stone-100 border-stone-800'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {program.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-amber-700/40" />
                <h2 className="font-serif text-xl text-stone-800">
                  Your Resources ({filteredResources.length})
                </h2>
              </div>
              {filteredResources.length === 0 ? (
                <p className="font-serif text-lg text-stone-400">No resources match your filters.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-start gap-4 bg-white border border-stone-200/80 rounded-sm p-5 hover:shadow-card transition-all duration-200"
                    >
                      <div className="w-10 h-10 rounded-sm bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-500 shrink-0">
                        {typeIcons[resource.resource_type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-sans font-medium text-stone-800 mb-0.5">
                          {resource.title}
                        </p>
                        <p className="text-xs font-sans font-light text-stone-500 leading-relaxed mb-3">
                          {resource.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-2xs font-sans text-stone-400 capitalize">
                            {resource.resource_type}
                          </span>
                          {resource.program_title && (
                            <>
                              <span className="text-stone-300">|</span>
                              <span className="text-2xs font-sans text-stone-400">
                                {resource.program_title}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenResource(resource)}
                        disabled={!resource.file_url}
                        className="shrink-0 w-8 h-8 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-40 disabled:hover:bg-amber-50"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && !error && lockedResources.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-stone-300" />
                <h2 className="font-serif text-xl text-stone-400">
                  Locked Resources ({lockedResources.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lockedResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-start gap-4 bg-stone-50 border border-stone-200/60 rounded-sm p-5 opacity-60"
                  >
                    <div className="w-10 h-10 rounded-sm bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 shrink-0">
                      <Lock size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans font-medium text-stone-500 mb-0.5">
                        {resource.title}
                      </p>
                      <p className="text-xs font-sans text-stone-400 capitalize">
                        {resource.resource_type} | Requires {resource.access_level} access
                      </p>
                      {resource.program_title && (
                        <p className="text-2xs font-sans text-stone-400 mt-1">
                          Program: {resource.program_title}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
