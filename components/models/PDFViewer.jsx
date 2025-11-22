"use client"
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Loader2 } from "lucide-react";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker - using unpkg as a reliable CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = () => {
    const [fileUrl, setFileUrl] = useState("");
    const [title, setTitle] = useState("");
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulating searchParams - replace with actual implementation
        const urlParams = new URLSearchParams(window.location.search);
        const url = urlParams.get('url');
        const fileTitle = urlParams.get('title');
        
        if (url) {
            setFileUrl(decodeURIComponent(url));
        }
        if (fileTitle) {
            setTitle(decodeURIComponent(fileTitle));
        }
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
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={null}
                        className="shadow-lg"
                        options={{
                            cMapUrl: 'https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/',
                            cMapPacked: true,
                        }}
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className="bg-white"
                        />
                    </Document>
                </div>
            </div>
        </div>
    );
};

export default PDFViewer;