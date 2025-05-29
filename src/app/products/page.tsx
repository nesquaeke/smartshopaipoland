'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// ... existing code ...

function ProductsContent() {
  const searchParams = useSearchParams();
  // ... rest of the existing component code ...
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div></div>}>
      <ProductsContent />
    </Suspense>
  );
} 