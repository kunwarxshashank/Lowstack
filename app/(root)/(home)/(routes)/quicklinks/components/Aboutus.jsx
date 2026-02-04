"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Info, BookOpen, Shield, HelpCircle, Truck, RefreshCcw } from "lucide-react";

const Aboutus = () => {
  const router = useRouter();

  const cards = [
    { title: "About Us", url: "/about", icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Learn about our mission and vision." },
    { title: "Contact Us", url: "/contact", icon: HelpCircle, color: "text-green-500", bg: "bg-green-500/10", desc: "Get in touch with our support team." },
    { title: "Privacy Policy", url: "/privacypolicy", icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10", desc: "How we handle and protect your data." },
    { title: "Terms & Conditions", url: "/terms", icon: BookOpen, color: "text-orange-500", bg: "bg-orange-500/10", desc: "Rules for using our platform." },
    { title: "Shipping Policy", url: "/shippingpolicy", icon: Truck, color: "text-cyan-500", bg: "bg-cyan-500/10", desc: "Details on delivery and shipping." },
    { title: "Refund Policy", url: "/refundpolicy", icon: RefreshCcw, color: "text-red-500", bg: "bg-red-500/10", desc: "information about refunds and returns." },
  ];

  return (
    <section className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-base-content mb-6">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">LowStack</span>
        </h1>
        <p className="text-lg md:text-xl text-base-content/70 leading-relaxed">
          Empowering students and schools with secure, reliable, and accessible educational resources. Explore our quick links below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {cards.map(({ title, url, icon: Icon, color, bg, desc }) => (
          <div
            key={title}
            className="group relative overflow-hidden rounded-3xl bg-base-200/50 backdrop-blur-md border border-base-content/5 p-6 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer hover:-translate-y-1"
            onClick={() => router.push(url)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-2xl ${bg} ${color} transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={24} />
              </div>
              <h2 className="text-xl font-bold text-base-content group-hover:text-primary transition-colors">{title}</h2>
            </div>

            <p className="text-base-content/60 mb-6 pl-1">
              {desc}
            </p>

            <div className="flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
              View Details <ArrowRight size={16} className="ml-1" />
            </div>

            {/* Decorative Background Blob */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${bg.replace('/10', '/30')}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Aboutus;
