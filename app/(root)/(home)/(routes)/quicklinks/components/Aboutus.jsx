"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logo } from "@/public/assets";

const Aboutus = () => {
  const router = useRouter();

  const cards = [
    { title: "About Us", url: "/about" },
    { title: "Contact Us", url: "/contact" },
    { title: "Privacy Policy", url: "/privacypolicy" },
    { title: "Terms & Conditions", url: "/terms" },
    { title: "Shipping Policy", url: "/shippingpolicy" },
    { title: "Refund Policy", url: "/refundpolicy" },
  ];

  return (
    <section className="min-h-screen p-8 bg-base-100 text-base-content">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to LowStack</h1>
        <p className="text-lg mb-10 text-neutral/80">
          Empowering students and schools with secure, reliable, and accessible educational resources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {cards.map(({ title, url }) => (
          <div
            key={title}
            className="rounded-lg shadow p-6 border border-base-300 bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
            onClick={() => router.push(url)}
          >
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <p className="text-0.5xl font-small mb-2">
              Click here to view the detailed {title.toLowerCase()}.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Aboutus;
