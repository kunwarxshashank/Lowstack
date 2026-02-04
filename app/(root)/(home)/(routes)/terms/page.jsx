import React from "react";
import { ScrollText, ShieldCheck, UserCheck, AlertTriangle } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-base-content mb-6">
          Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Conditions</span>
        </h1>
        <p className="text-lg md:text-xl text-base-content/70 leading-relaxed">
          Please read these terms carefully before using LowStack. They outline the rules and regulations for the use of our educational platform.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Card 1: Platform Usage */}
        <section className="bg-base-200/50 backdrop-blur-md border border-base-content/5 rounded-3xl p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <ScrollText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-3">Platform Usage</h2>
              <p className="text-base-content/70 leading-relaxed">
                LowStack is a platform designed exclusively for educational purposes. Users are expected to utilize the resources responsibly to enhance their learning experience. Any misuse, including but not limited to sharing inappropriate content or attempting to disrupt the service, will result in immediate account suspension.
              </p>
            </div>
          </div>
        </section>

        {/* Card 2: School Registration */}
        <section className="bg-base-200/50 backdrop-blur-md border border-base-content/5 rounded-3xl p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
              <UserCheck size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-3">School Registration</h2>
              <p className="text-base-content/70 leading-relaxed">
                Schools registering on LowStack must provide accurate and verifiable information. By creating an institutional account, schools agree to these terms and accept responsibility for the educational conduct of their students on the platform.
              </p>
            </div>
          </div>
        </section>

        {/* Card 3: Content Guidelines */}
        <section className="bg-base-200/50 backdrop-blur-md border border-base-content/5 rounded-3xl p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-3">Content Guidelines</h2>
              <p className="text-base-content/70 leading-relaxed">
                All uploaded content must be strictly educational. We have a zero-tolerance policy for 18+, harmful, or offensive material. Our moderation team monitors the platform 24/7, and violations will lead to permanent bans and potential legal action.
              </p>
            </div>
          </div>
        </section>

        {/* Card 4: Account Security */}
        <section className="bg-base-200/50 backdrop-blur-md border border-base-content/5 rounded-3xl p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-green-500/10 text-green-500">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-3">Account Security</h2>
              <p className="text-base-content/70 leading-relaxed">
                Users are responsible for maintaining the confidentiality of their account credentials. We recommend using strong, unique passwords. If you suspect any unauthorized access, please contact our support team immediately.
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

export default Terms;
