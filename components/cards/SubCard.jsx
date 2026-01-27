import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, CodeBracketIcon } from "@heroicons/react/24/outline";

import { subject } from "@/public/icons";

const SubCard = ({ hrefData, data }) => {
  return (
    <Link
      href={hrefData}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-base-100 to-base-200 hover:from-primary/5 hover:to-secondary/5 border border-base-content/10 hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-secondary/0 to-accent/0 group-hover:from-primary/10 group-hover:via-secondary/10 group-hover:to-accent/10 transition-all duration-500"></div>
      
      {/* Decorative Corner Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-300"></div>
      
      <div className="relative flex items-center gap-4 p-5 sm:p-6">
        {/* Subject Icon */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-3 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Image 
              src={subject} 
              alt={data.subject_name}
              className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
            />
          </div>
          {/* Pulse Effect */}
          <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Subject Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-base-content mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {data.subject_name}
          </h3>
          
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 bg-base-300/50 group-hover:bg-primary/10 px-2.5 py-1 rounded-lg transition-colors">
              <CodeBracketIcon className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold text-base-content/80 uppercase">
                {data.subject_code}
              </span>
            </div>
          </div>
        </div>

        {/* Arrow Icon */}
        <div className="shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20">
            <ArrowRightIcon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </Link>
  );
};

export default SubCard;
