import Link from "next/link";
import {
  FiMail,
  FiInfo,
  FiFileText,
  FiUsers,
  FiShield,
  FiTruck,
  FiRefreshCw,
} from "react-icons/fi";

import {
  Contribution
} from "./components"

const quickLinks = [
  {
    label: "Contact Us",
    description: "Get in touch with our support team",
    href: "/contact",
    icon: FiMail,
    gradient: "from-blue-500 to-cyan-400",
    shadowColor: "shadow-blue-500/20",
    hoverBorder: "hover:border-blue-500/50",
  },
  {
    label: "About Us",
    description: "Learn more about LowStack and our mission",
    href: "/about",
    icon: FiInfo,
    gradient: "from-violet-500 to-purple-400",
    shadowColor: "shadow-violet-500/20",
    hoverBorder: "hover:border-violet-500/50",
  },
  {
    label: "Terms & Conditions",
    description: "Read our terms of service and usage policy",
    href: "/terms",
    icon: FiFileText,
    gradient: "from-amber-500 to-yellow-400",
    shadowColor: "shadow-amber-500/20",
    hoverBorder: "hover:border-amber-500/50",
  },
  {
    label: "Our Team",
    description: "Meet the people behind LowStack",
    href: "/about",
    icon: FiUsers,
    gradient: "from-emerald-500 to-green-400",
    shadowColor: "shadow-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/50",
  },
  {
    label: "Privacy Policy",
    description: "Understand how we handle your data",
    href: "/privacypolicy",
    icon: FiShield,
    gradient: "from-rose-500 to-pink-400",
    shadowColor: "shadow-rose-500/20",
    hoverBorder: "hover:border-rose-500/50",
  },
  {
    label: "Refund Policy",
    description: "Our refund terms and conditions",
    href: "/refundpolicy",
    icon: FiRefreshCw,
    gradient: "from-orange-500 to-red-400",
    shadowColor: "shadow-orange-500/20",
    hoverBorder: "hover:border-orange-500/50",
  },
  {
    label: "Shipping Policy",
    description: "Details on delivery and shipping",
    href: "/shippingpolicy",
    icon: FiTruck,
    gradient: "from-sky-500 to-indigo-400",
    shadowColor: "shadow-sky-500/20",
    hoverBorder: "hover:border-sky-500/50",
  },
];

const QuickLinks = () => {
  return (
    <>
      <Contribution />

      <div className="flex justify-center items-start px-4 py-10 w-full min-h-screen">
        <div className="xl:max-w-[1280px] w-full">
          {/* Header */}
          <div className="mb-5 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content mb-3 tracking-tight">
              Quick{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Links
              </span>
            </h1>
          </div>

          {/* Grid of Quick Link Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {quickLinks.map(
              ({
                label,
                description,
                href,
                icon: Icon,
                gradient,
                shadowColor,
                hoverBorder,
              }) => (
                <Link
                  key={label}
                  href={href}
                  className={`group relative flex flex-col items-start gap-4 p-5 rounded-2xl bg-base-200 border border-base-300 transition-all duration-300 ${hoverBorder} hover:shadow-lg ${shadowColor} hover:-translate-y-1`}
                >
                  {/* Icon Badge */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="text-white text-xl" />
                  </div>

                  {/* Text */}
                  <div>
                    <h2 className="text-base font-bold text-base-content group-hover:text-primary transition-colors duration-200">
                      {label}
                    </h2>
                    <p className="text-xs text-base-content/50 mt-1 leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-base-content/40">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </>

  );
};

export default QuickLinks;
