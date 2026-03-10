"use client";

import Link from "next/link";
import { Megaphone, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const AnnouncementSection = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [current, setCurrent] = useState(0);
    const [dismissed, setDismissed] = useState(false);
    const [visible, setVisible] = useState(true);

    // Fetch active announcements from API
    useEffect(() => {
        fetch("/api/admin/announcements")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) setAnnouncements(data);
            })
            .catch(() => { });
    }, []);

    // Auto-rotate
    useEffect(() => {
        if (announcements.length <= 1) return;
        const timer = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % announcements.length);
                setVisible(true);
            }, 300);
        }, 4000);
        return () => clearInterval(timer);
    }, [announcements]);

    if (dismissed || announcements.length === 0) return null;

    const item = announcements[current];

    const goTo = (idx) => {
        setVisible(false);
        setTimeout(() => {
            setCurrent(idx);
            setVisible(true);
        }, 300);
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 mb-1">
            <div className="relative rounded-xl bg-base-200/60 backdrop-blur-sm px-3 py-2.5 flex items-center gap-3">

                {/* Left accent line */}
                <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-primary via-secondary to-transparent rounded-full" />

                {/* Megaphone icon */}
                <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-primary/15 ml-1">
                    <Megaphone className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                </div>

                {/* Label */}
                <span className="flex-shrink-0 text-[11px] font-bold uppercase tracking-widest text-base-content/40 hidden sm:block">
                    Announcements
                </span>

                {/* Divider */}
                <div className="hidden sm:block w-px h-4 bg-base-content/10 flex-shrink-0" />

                {/* Single announcement */}
                <Link
                    href={item.href}
                    className="flex-1 group inline-flex items-center gap-2 min-w-0"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(4px)",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                    }}
                >
                    <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.tagColor}`}>
                        {item.tag}
                    </span>
                    <span className="text-xs text-base-content/70 group-hover:text-base-content transition-colors truncate">
                        {item.text}
                    </span>
                    <ChevronRight
                        className="flex-shrink-0 w-3 h-3 text-base-content/30 group-hover:text-primary transition-colors"
                        strokeWidth={2.5}
                    />
                </Link>

                {/* Dot indicators (only shown if more than 1) */}
                {announcements.length > 1 && (
                    <div className="flex-shrink-0 hidden sm:flex items-center gap-1">
                        {announcements.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goTo(idx)}
                                className={`rounded-full transition-all duration-300 ${idx === current
                                        ? "w-3 h-1.5 bg-primary"
                                        : "w-1.5 h-1.5 bg-base-content/20 hover:bg-base-content/40"
                                    }`}
                                aria-label={`Announcement ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Dismiss */}
                <button
                    onClick={() => setDismissed(true)}
                    className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md hover:bg-base-content/10 text-base-content/30 hover:text-base-content/60 transition-all"
                    aria-label="Dismiss announcements"
                >
                    <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default AnnouncementSection;
