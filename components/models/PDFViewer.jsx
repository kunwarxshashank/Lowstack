"use client";

import { useState, useEffect } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Loader2, Download } from "lucide-react";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PDFViewer = () => {
    const [fileUrl, setFileUrl] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);

    // Initialize the default layout plugin
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    // Read query params (?url=...&title=...)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const url = params.get("url");
        const t = params.get("title");

        if (url) {
            // Use the actual URL from params, but keep the fallback logic or security checks if needed
            setFileUrl(decodeURIComponent(url));
        }
        if (t) {
            setTitle(decodeURIComponent(t));
        }
        setLoading(false);
    }, []);

    const handleDownload = () => {
        if (!fileUrl) return;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = title || "document.pdf";
        link.target = "_blank";
        link.click();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-base-content/60 font-medium">Preparing document...</p>
                </div>
            </div>
        );
    }

    if (!fileUrl) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-base-content/60">
                No document URL provided.
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-base-100">
            {/* Custom Header */}
            <div className="bg-base-200/50 backdrop-blur-md border-b border-base-content/5 px-4 py-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-lg font-bold text-base-content truncate max-w-[200px] sm:max-w-md">
                        {title || "PDF Viewer"}
                    </h1>
                </div>
                <button
                    onClick={handleDownload}
                    className="btn btn-primary btn-sm rounded-full px-4 gap-2"
                >
                    <Download size={16} />
                    <span className="hidden sm:inline">Download</span>
                </button>
            </div>

            {/* Viewer Area */}
            <div className="flex-1 overflow-hidden relative">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer
                        fileUrl={fileUrl}
                        plugins={[defaultLayoutPluginInstance]}
                        theme={typeof window !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'}
                    />
                </Worker>
            </div>
        </div>
    );
};

export default PDFViewer;