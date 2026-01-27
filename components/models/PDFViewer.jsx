"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Download,
    Loader2,
} from "lucide-react";

import { pdfjs } from "react-pdf";

// ✅ IMPORTANT: Correct worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();

// Dynamically import react-pdf components (no SSR)
const Document = dynamic(
    () => import("react-pdf").then((m) => m.Document),
    { ssr: false }
);

const Page = dynamic(
    () => import("react-pdf").then((m) => m.Page),
    { ssr: false }
);

// Load styles only on client
if (typeof window !== "undefined") {
    import("react-pdf/dist/Page/AnnotationLayer.css");
    import("react-pdf/dist/Page/TextLayer.css");
}

const PDFViewer = () => {
    const [fileUrl, setFileUrl] = useState("");
    const [title, setTitle] = useState("");
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Read query params (?url=...&title=...)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const url = params.get("url");
        const t = params.get("title");

        if (url) setFileUrl(decodeURIComponent("https://pdfobject.com/pdf/sample.pdf"));
        if (t) setTitle(decodeURIComponent(t));
    }, []);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoading(false);
        setError(null);
    };

    const onDocumentLoadError = (error) => {
        console.error('Error loading PDF:', error);
        setError('Failed to load PDF. Please check the URL and try again.');
        setLoading(false);
    };

    const goToPrevPage = () => {
        setPageNumber(prev => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber(prev => Math.min(prev + 1, numPages));
    };

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.2, 3.0));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.2, 0.5));
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = title || 'document.pdf';
        link.target = '_blank';
        link.click();
    };

    if (!pdfjs) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Loader2 className="animate-spin" size={24} />
                    <span>Initializing PDF viewer...</span>
                </div>
            </div>
        );
    }

    if (!fileUrl) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
                <div className="text-gray-600 dark:text-gray-400 text-lg">
                    No file URL provided
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-md border-b dark:border-gray-700 p-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                    {title || "PDF Viewer"}
                </h1>
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Download size={18} />
                    Download
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-3 flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300 min-w-[100px] text-center">
                        {numPages ? `${pageNumber} / ${numPages}` : 'Loading...'}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleZoomOut}
                        disabled={scale <= 0.5}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ZoomOut size={20} />
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={handleZoomIn}
                        disabled={scale >= 3.0}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ZoomIn size={20} />
                    </button>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-auto bg-gray-200 dark:bg-gray-900 p-4">
                <div className="flex justify-center">
                    {loading && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Loader2 className="animate-spin" size={24} />
                            <span>Loading PDF...</span>
                        </div>
                    )}
                    {error && (
                        <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                            {error}
                        </div>
                    )}
                    {pdfjs && (
                        <Document
                            file={"https://pdfobject.com/pdf/sample.pdf"}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading={null}
                            className="shadow-lg"
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="bg-white"
                            />
                        </Document>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PDFViewer;