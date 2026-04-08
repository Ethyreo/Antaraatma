'use client';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import ProgramManagementTopbar from './ProgramManagementTopbar';
import ProgramTable from './ProgramTable';
import ModuleTree from './ModuleTree';
import CreateProgramModal from './CreateProgramModal';
import { createClient } from '@/lib/supabase/client';

export default function ProgramManagementContent() {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // Auto-select first program
    const supabase = createClient();
    supabase?.from('programs')?.select('id')?.order('sort_order', { ascending: true })?.limit(1)?.maybeSingle()?.then(({ data }) => {
        if (data?.id) setSelectedProgramId(data?.id);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="bottom-right" richColors />
      <ProgramManagementTopbar onCreateProgram={() => setShowCreateModal(true)} />

      <div className="flex-1 p-6 xl:p-8 2xl:p-10 max-w-screen-2xl mx-auto w-full space-y-6">
        <ProgramTable
          selectedProgramId={selectedProgramId}
          onSelectProgram={setSelectedProgramId}
        />
        {selectedProgramId && (
          <ModuleTree programId={selectedProgramId} />
        )}
      </div>

      {showCreateModal && (
        <CreateProgramModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}