"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import UniversitySwitcher from "../UniversitySwitcher";

const slides = [
    {
        id: 1,
        title: "Master Your Engineering Journey",
        subtitle: " Access Notes, PYQ's, and Study Materials tailored for your university curriculum.",
        gradient: "from-primary/10 via-transparent to-secondary/10",
        pattern: "bg-grid-white/[0.02]",
        color: "text-primary"
    },
    {
        id: 2,
        title: "Ace Your Semester Exams",
        subtitle: "Get organized previous year questions and solved papers to boost your preparation.",
        gradient: "from-blue-500/10 via-transparent to-purple-500/10",
        pattern: "bg-dot-white/[0.2]",
        color: "text-blue-500"
    },
    {
        id: 3,
        title: "Collaborate & Grow Together",
        subtitle: "Join thousands of students sharing resources and helping each other succeed.",
        gradient: "from-orange-500/10 via-transparent to-red-500/10",
        pattern: "bg-grid-white/[0.02]",
        color: "text-orange-500"
    }
];

const HeroSlider = ({ session, selectedUniversity, updateUniversity, allUniversities }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="relative w-full rounded-3xl overflow-hidden bg-base-200/30 border border-base-content/5 shadow-2xl group min-h-[350px] md:min-h-[400px] flex items-center">

            {/* Dynamic Backgrounds */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {/* Gradient Base */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />

                    {/* Pattern Overlay */}
                    <div className={`absolute inset-0 ${slide.pattern} opacity-30`}
                        style={{ backgroundImage: slide.pattern.includes('dot') ? 'radial-gradient(#ffffff 1px, transparent 1px)' : undefined, backgroundSize: slide.pattern.includes('dot') ? '20px 20px' : undefined }}
                    />

                    {/* Animated Blobs */}
                    <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-${slide.color.split('-')[1]}-500/10 rounded-full blur-3xl opacity-50 animate-pulse`} />
                    <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl opacity-50`} />
                </div>
            ))}

            {/* Content Container - Using Grid for Stacking */}
            <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 md:py-12 z-10 grid grid-cols-1">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`col-start-1 row-start-1 w-full transition-all duration-700 ease-out transform flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 ${index === current
                            ? "opacity-100 translate-y-0 relative pointer-events-auto"
                            : "opacity-0 translate-y-8 absolute pointer-events-none"
                            }`}
                    >
                        {/* Text Area */}
                        <div className="flex-1 space-y-4 md:space-y-6 max-w-2xl text-center md:text-left">
                            {session?.user && index === 0 && (
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-100/50 backdrop-blur-md border border-base-content/10 text-xs md:text-sm font-medium text-base-content/80 shadow-sm animate-in fade-in slide-in-from-left-4 duration-700 mx-auto md:mx-0">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Welcome back, {session.user.name}
                                </div>
                            )}

                            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight text-base-content leading-[1.1]">
                                {slide.title.split(" ").slice(0, -1).join(" ")} <br />
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary`}>
                                    {slide.title.split(" ").slice(-1)}
                                </span>
                            </h1>
                            <p className="text-sm md:text-lg text-base-content/70 max-w-lg leading-relaxed font-medium mx-auto md:mx-0">
                                {slide.subtitle}
                            </p>

                            <div className="pt-2 md:pt-4 flex gap-3 md:gap-4 justify-center md:justify-start">
                                <button className="btn btn-primary btn-sm md:btn-md rounded-full px-6 shadow-lg hover:shadow-primary/40 transition-all hover:scale-105 border-none bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs md:text-base">
                                    Get Started
                                </button>
                                <button className="btn btn-ghost btn-sm md:btn-md rounded-full px-6 hover:bg-base-content/10 text-xs md:text-base">
                                    Learn More
                                </button>
                            </div>
                        </div>

                        {/* Right Side: University Selector (Slide 1) or Ad Content (Others) */}
                        <div className={`w-full md:w-auto flex flex-col items-center md:items-end justify-center ${index === 0 ? "block" : "hidden md:flex"}`}>

                            {index === 0 && selectedUniversity && (
                                <div className="flex flex-col items-center md:items-end gap-2 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                                    <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Current University</span>
                                    <UniversitySwitcher
                                        selectedUniversity={selectedUniversity}
                                        onUniversityChange={updateUniversity}
                                        universities={allUniversities}
                                    />
                                </div>
                            )}

                            {index !== 0 && (
                                <div className="hidden md:flex flex-col items-center justify-center p-8 rounded-3xl bg-base-100/10 border border-white/5 backdrop-blur-sm rotate-3 transform transition-transform hover:rotate-0">
                                    {/* Placeholder for ad: could be an icon or text */}
                                    <div className="text-4xl">🚀</div>
                                    <p className="text-sm font-bold text-base-content/60 mt-2">Join the Community</p>
                                </div>
                            )}
                        </div>

                    </div>
                ))}
            </div>

            {/* Slider Navigation Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${idx === current
                            ? "bg-primary w-6"
                            : "bg-base-content/20 hover:bg-base-content/40"
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Arrow Navigation */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-base-100/10 backdrop-blur-md border border-white/5 hover:bg-base-100/20 text-base-content/50 hover:text-primary transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 hidden md:block"
            >
                <ChevronLeft size={20} />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-base-100/10 backdrop-blur-md border border-white/5 hover:bg-base-100/20 text-base-content/50 hover:text-primary transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 hidden md:block"
            >
                <ChevronRight size={20} />
            </button>

        </div>
    );
};

export default HeroSlider;
