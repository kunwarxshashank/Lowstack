import React from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-base-content mb-6">
          Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Touch</span>
        </h1>
        <p className="text-lg md:text-xl text-base-content/70 leading-relaxed">
          Have questions, feedback, or need assistance? We're here to help you on your educational journey.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">

        {/* Email Card */}
        <a href="mailto:screation190@gmail.com" className="group block">
          <div className="h-full bg-base-200/50 backdrop-blur-md border border-base-content/5 rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center justify-center">
            <div className="p-4 rounded-full bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
              <Mail size={32} />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-2">Email Us</h3>
            <p className="text-base-content/60 mb-6">For general inquiries and support</p>
            <div className="px-6 py-3 rounded-full bg-base-100 border border-base-content/10 text-base-content font-semibold group-hover:border-primary/50 transition-colors">
              ahighrisk@gmail.com
            </div>
          </div>
        </a>

        {/* Phone Card */}
        <a href="https://chat.whatsapp.com/HPLZTPSGHBnAw6IWgV5K2E" className="group block">
          <div className="h-full bg-base-200/50 backdrop-blur-md border border-base-content/5 rounded-3xl p-8 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center justify-center">
            <div className="p-4 rounded-full bg-secondary/10 text-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
              <Phone size={32} />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-2">Call Us</h3>
            <p className="text-base-content/60 mb-6">Why Call Us?</p>
            <div className="px-6 py-3 rounded-full bg-base-100 border border-base-content/10 text-base-content font-semibold group-hover:border-secondary/50 transition-colors">
              Lol, we don't have a phone number
            </div>
          </div>
        </a>

      </div>

      {/* Additional Info / CTA */}
      <div className="mt-16 text-center max-w-2xl bg-base-200/30 rounded-2xl p-8 border border-base-content/5">
        <div className="flex justify-center mb-4 text-green-500">
          <MessageCircle size={28} />
        </div>
        <h3 className="text-xl font-bold text-base-content mb-2">Need Live Support?</h3>
        <p className="text-base-content/70">
          Join our WhatsApp group for instant updates and community support.
        </p>
        <a href="https://chat.whatsapp.com/HPLZTPSGHBnAw6IWgV5K2E" className="mt-6  btn btn-primary rounded-full px-8">Join Community</a>
      </div>

    </div>
  );
};

export default Contact;
