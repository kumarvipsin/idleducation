'use client';

import React from 'react';
import { BranchInfo } from '@/data/branches-data';
import type { BranchClassCatalogResult } from '@/lib/branch-courses';
import MangolpuriBranchClient from './mangolpuri-branch-client';
import BudhviharBranchClient from './budhvihar-branch-client';
import KrishanviharBranchClient from './krishanvihar-branch-client';
import GenericBranchClient from './generic-branch-client';

interface BranchDetailClientProps {
  branch: BranchInfo;
  initialCatalog?: BranchClassCatalogResult;
}

export default function BranchDetailClient({ branch, initialCatalog }: BranchDetailClientProps) {
  const isMangolpuri = branch.id === 'mangolpuri' || branch.slug === 'mangolpuri';
  const isBudhVihar = branch.id === 'budh-vihar' || branch.slug === 'budh-vihar';
  const isKrishanVihar =
    branch.id === 'krishna-vihar' ||
    branch.slug === 'krishna-vihar' ||
    branch.slug === 'krishan-vihar';

  if (isMangolpuri) {
    return <MangolpuriBranchClient branch={branch} initialCatalog={initialCatalog} />;
  }

  if (isBudhVihar) {
    return <BudhviharBranchClient branch={branch} initialCatalog={initialCatalog} />;
  }

  if (isKrishanVihar) {
    return <KrishanviharBranchClient branch={branch} initialCatalog={initialCatalog} />;
  }

  return <GenericBranchClient branch={branch} />;
}
