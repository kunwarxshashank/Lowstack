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
    <Link href={hrefData} className={`group ${style}`}>
      <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-base-100 to-base-200/50 backdrop-blur-md border border-base-content/10 p-3 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1 ${styleContent}`}>

        {/* Gradient Glow Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Animated corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
          <figure className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-2.5 mb-2.5 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ring-1 ring-primary/10 shadow-sm">
            <Image src={data.imgUrl} alt={altMsg} width={100} height={100} unoptimized className="object-contain w-full h-full drop-shadow-md" />
          </figure>

          <div className="text-center">
            <h2
              className={`text-sm md:text-base font-bold text-base-content tracking-tight group-hover:text-primary transition-colors line-clamp-2 leading-tight ${syleName}`}
            >

              {sem && <span className="ml-1 text-[12px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{displayName + " " + sem}</span>}
            </h2>
            {data.description && (
              <p className="text-[10px] md:text-xs text-base-content/50 mt-1 line-clamp-1 font-medium">{data.description}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DataCard;
