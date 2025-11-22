"use client"
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const PDFViewer = dynamic(() => import('@/components/models/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <Loader2 className="animate-spin" size={24} />
        <span>Loading PDF Viewer...</span>
      </div>
    </div>
  ),
});

export default function EmbedFile() {
  return <PDFViewer />;
}