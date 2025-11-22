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
    <Link href={hrefData} className={`rounded-xl ${style}`}>
      <div className={`card cursor-pointer items-center bg-base-200 hover:bg-base-300 shadow-md transition-colors rounded-xl p-3 ${styleContent}`}>
        <div>
          <figure className="w-16 h-16 md:w-20 md:h-20 bg-base-300 rounded-full overflow-hidden p-3.5">
            <Image src={data.imgUrl} alt={altMsg} />
          </figure>
        </div>
        <div className="items-center text-center">
          <h2
            className={`text-base font-medium md:font-semibold font-sans md:font-mono mt-2 text-base-content ${syleName}`}
          >
            {displayName}
            {sem && <span className="pl-1.5">{sem}</span>}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default DataCard;
