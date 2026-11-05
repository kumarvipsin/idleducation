'use client';

import React from 'react';
import { BranchInfo } from '@/data/branches-data';
import MangolpuriBranchClient from './mangolpuri-branch-client';
import GenericBranchClient from './generic-branch-client';

interface BranchDetailClientProps {
  branch: BranchInfo;
}

export default function BranchDetailClient({ branch }: BranchDetailClientProps) {
  const isMangolpuri = branch.id === 'mangolpuri' || branch.slug === 'mangolpuri';

  if (isMangolpuri) {
    return <MangolpuriBranchClient branch={branch} />;
  }

  return <GenericBranchClient branch={branch} />;
}
