import Link from "next/link";
import Image from "next/image";

const DataCard = ({
  hrefData,
  data,
  altMsg,
  style,
  styleContent,
  syleName,
  sem,
}) => {
  const displayName = data.name === "Videos" ? "Quiz" : data.name;

  return (
    <Link href={hrefData} className={`group relative block ${style}`}>
      {/* Main Card Container */}
      <div className={`relative h-full overflow-hidden rounded-2xl bg-[#0e0e10]/80 border border-white/5 p-4 transition-all duration-300 group-hover:bg-[#15151b] group-hover:border-primary/20 group-hover:shadow-[0_0_30px_-5px_rgba(29,192,113,0.3)] group-hover:-translate-y-1 ${styleContent}`}>

        {/* Animated Background Gradient Blob */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-[50px] opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-[50px] opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full gap-3">

          {/* Icon Container with Glass Effect */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 p-3 shadow-inner ring-1 ring-white/10 group-hover:ring-primary/40 group-hover:scale-110 transition-all duration-300">
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            <Image
              src={data.imgUrl}
              alt={altMsg}
              width={80}
              height={80}
              unoptimized
              className="relative object-contain w-full h-full drop-shadow-sm group-hover:rotate-6 transition-transform duration-300"
            />
          </div>

          {/* Text Content */}
          <div className="w-full space-y-1">
            <h2 className={`text-base md:text-lg font-bold text-gray-200 tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2 ${syleName}`}>
              {sem ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{sem}</span>
                  {displayName}
                </span>
              ) : (
                displayName
              )}
            </h2>

            {data.description && (
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500 group-hover:text-gray-400 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                <p className="line-clamp-1">{data.description.split("•")[0]?.trim() || data.description}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
};

export default DataCard;
