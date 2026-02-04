import React from "react";
import { Target, Sparkles, Shield, Users, BookOpen, Globe, Award, Rocket } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-in fade-in zoom-in duration-500">
          <Sparkles size={16} /> Empowering Education
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-base-content mb-6 leading-tight">
          Redefining the <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Future of Learning</span>
        </h1>
        <p className="text-lg md:text-xl text-base-content/70 leading-relaxed max-w-2xl mx-auto">
          LowStack is more than just a platform; it's a movement to bridge the gap between schools, students, and digital excellence.
        </p>
      </div>

      {/* Mission & What We Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-6xl mx-auto">

        {/* Card 1 */}
        <div className="relative overflow-hidden rounded-3xl bg-base-200/50 backdrop-blur-md border border-base-content/5 p-8 md:p-12 hover:shadow-2xl transition-all duration-500 group">
          <div className="absolute top-0 right-0 p-12 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform transform group-hover:scale-110 duration-700">
            <Target size={64} className="text-primary/20" />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Rocket size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-base-content mb-4">Our Mission</h2>
            <p className="text-base-content/70 text-lg leading-relaxed">
              To make high-quality education accessible, engaging, and secure for everyone. We aim to remove barriers to learning by providing top-tier resources and mentorship to students regardless of their location.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative overflow-hidden rounded-3xl bg-base-200/50 backdrop-blur-md border border-base-content/5 p-8 md:p-12 hover:shadow-2xl transition-all duration-500 group">
          <div className="absolute top-0 right-0 p-12 bg-secondary/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform transform group-hover:scale-110 duration-700">
            <Award size={64} className="text-secondary/20" />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
              <Globe size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-base-content mb-4">Our Vision</h2>
            <p className="text-base-content/70 text-lg leading-relaxed">
              We envision a world where every student has the tools they need to succeed. By fostering a collaborative and safe digital environment, we are shaping the next generation of innovators and leaders.
            </p>
          </div>
        </div>

      </div>

      {/* Core Values / Features Grid */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-base-content text-center mb-10">Why Choose LowStack?</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-base-100 border border-base-content/5 text-center hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-lg">
            <div className="mx-auto w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
              <BookOpen size={28} />
            </div>
            <h4 className="text-xl font-bold text-base-content mb-2">Quality Resources</h4>
            <p className="text-base-content/60">Curated notes, PYQs, and materials tailored for your curriculum.</p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-base-100 border border-base-content/5 text-center hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-lg">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
              <Shield size={28} />
            </div>
            <h4 className="text-xl font-bold text-base-content mb-2">Safe & Secure</h4>
            <p className="text-base-content/60">A monitored environment prioritizing student privacy and data security.</p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-base-100 border border-base-content/5 text-center hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-lg">
            <div className="mx-auto w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4">
              <Users size={28} />
            </div>
            <h4 className="text-xl font-bold text-base-content mb-2">Community First</h4>
            <p className="text-base-content/60">Connect with mentors and peers to collaborate and grow together.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutUs;
