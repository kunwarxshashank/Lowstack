import Image from "next/image";
import Link from "next/link";
import { IconBrandGithub } from "@tabler/icons-react";
const Contribution = () => {
  const contributeText = {
    title: "LowStack - Non Profit Stack !",
    desc: "Lowstack is a free, nonprofit platform created to make learning simpler for college students. It’s your one-stop hub for study notes, previous year question papers (PYQs), detailed roadmaps, and updated syllabus — all curated to help you stay organized and exam-ready.",
    subDesc:
      "We highly appreciate any feedback or contribution that could help us improve.",
  };
  return (
    <section className="w-full mt-1 ">
      <div className="flex justify-center items-center flex-col-reverse md:flex-row">
        <div>
          <Image
            src="/img/logs.png"
            alt="github contribution svg"
            width={350}
            height={350}
          />
        </div>
        <div className="items-center text-center font-normal sm:font-medium w-full md:w-[60%] text-[#808191]">
          <h3 className="text-3xl font-bold text-grey-900 mb-2">
            {contributeText.title}
          </h3>
          <p>{contributeText.desc}</p>
          <p className="mt-2">{contributeText.subDesc}</p>
          {/* <Link
            href="https://github.com/SHABIN-K/Studydrive"
            target="_blank"
            className="flex hover:text-white items-center justify-center mt-3 text-2xl gap-1 text-gray-400"
          >
            <IconBrandGithub size={30} />
            <p>Github</p>
          </Link> */}
        </div>
      </div>
    </section>
  );
};

export default Contribution;
