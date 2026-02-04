import React from "react";
import { Lock, Eye, Database, Globe } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-base-content mb-6">
          Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Policy</span>
        </h1>
        <p className="text-lg md:text-xl text-base-content/70 leading-relaxed">
          Your privacy is our priority. Learn how we collect, use, and protect your personal information at LowStack.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Card 1: Information Collection */}
        <section className="bg-base-200/50 backdrop-blur-md border border-base-content/5 rounded-3xl p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-3">Information We Collect</h2>
              <p className="text-base-content/70 leading-relaxed">
                We collect only the essential information needed to provide our educational services. This includes school registration details (name, code, contact info) and student data (name, roll number) required for creating accurate academic profiles.
              </p>
            </div>
          </div>
        </section>

        {/* Card 2: Usage of Information */}
        <section className="bg-base-200/50 backdrop-blur-md border border-base-content/5 rounded-3xl p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
              <Eye size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-3">How We Use Your Data</h2>
              <p className="text-base-content/70 leading-relaxed">
                Your data is used exclusively to facilitate your educational journey on LowStack. We use it for account management, providing access to relevant study materials, and ensuring a safe community environment. We strictlly do not sell your personal information to third parties.
              </p>
            </div>
          </div>
        </section>

        {/* Card 3: Student Privacy */}
        <section className="bg-base-200/50 backdrop-blur-md border border-base-content/5 rounded-3xl p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
              <Globe size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-3">Student Privacy & Safety</h2>
              <p className="text-base-content/70 leading-relaxed">
                We prioritize student safety by minimizing identity exposure to the public web. Our platform includes robust 24/7 content moderation to prevent harassment or inappropriate interactions, fostering a secure learning space.
              </p>
            </div>
          </div>
        </section>

        {/* Card 4: Data Security */}
        <section className="bg-base-200/50 backdrop-blur-md border border-base-content/5 rounded-3xl p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-green-500/10 text-green-500">
              <Lock size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-3">Data Security</h2>
              <p className="text-base-content/70 leading-relaxed">
                We employ industry-standard security measures to protect your data. All sensitive information is encrypted during transmission and storage. Our security team continuously monitors for potential threats to ensure the integrity of our systems.
              </p>
            </div>
          </div>
        </section>

      </div>
      <div className="text-center mt-12 text-base-content/50 text-sm">
        Last updated: {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
