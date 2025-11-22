import Link from "next/link";
import Image from "next/image";

import { subject } from "@/public/icons";

const SubCard = ({ hrefData, data }) => {
  return (
    <Link
      href={hrefData}
      className="card rounded-xl cursor-pointer bg-base-200 hover:bg-base-300 transition-colors py-3 shadow-md"
    >
      <div className="flex flex-row items-center ml-5">
        <div>
          <figure className="w-16 h-16 md:w-20 md:h-20 bg-base-300 rounded-full overflow-hidden">
            <Image src={subject} alt={data.subject_name} />
          </figure>
        </div>
        <div className="text-start ml-5">
          <p className="text-lg font-semibold font-sans md:font-mono mt-2 text-base-content">
            {data.subject_name}
          </p>
          <p className="text-base font-semibold font-sans md:font-mono mt-2 text-base-content">
            code : <span className="uppercase">{data.subject_code}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SubCard;
