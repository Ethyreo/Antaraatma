'use client';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import ProgramManagementTopbar from './ProgramManagementTopbar';
import ProgramTable from './ProgramTable';
import ModuleTree from './ModuleTree';
import CreateProgramModal from './CreateProgramModal';

export default function ProgramManagementContent() {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>('prog-foundation');
  const [showCreateModal, setShowCreateModal] = useState(false);

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