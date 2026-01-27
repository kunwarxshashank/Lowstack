import Image from "next/image";
import Link from "next/link";
import { IconBrandGithub, IconSparkles, IconHeart, IconRocket } from "@tabler/icons-react";

const Contribution = () => {
  const contributeText = {
    title: "LowStack - Non Profit Stack !",
    desc: "Lowstack is a free, nonprofit platform created to make learning simpler for college students. It's your one-stop hub for study notes, previous year question papers (PYQs), detailed roadmaps, and updated syllabus — all curated to help you stay organized and exam-ready.",
    subDesc:
      "We highly appreciate any feedback or contribution that could help us improve.",
  };

  const features = [
    { icon: <IconSparkles size={24} />, text: "Free Study Materials" },
    { icon: <IconHeart size={24} />, text: "Community Driven" },
    { icon: <IconRocket size={24} />, text: "Always Updated" },
  ];

  return (
    <section className="w-full mt-8 mb-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border border-base-content/10 shadow-2xl">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-2xl"></div>
        
        <div className="relative flex justify-center items-center flex-col-reverse md:flex-row gap-8 p-6 sm:p-8 md:p-12">
          {/* Image Section */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-base-100 rounded-3xl p-4 shadow-xl">
          <Image
            src="/img/logs.png"
            alt="github contribution svg"
            width={350}
            height={350}
                className="rounded-2xl"
          />
        </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 text-center md:text-left space-y-6">
            {/* Title with Gradient */}
            <div className="space-y-2">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            {contributeText.title}
          </h3>
              <div className="h-1 w-24 mx-auto md:mx-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"></div>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-base-content/80 leading-relaxed">
              {contributeText.desc}
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 hover:border-primary/40 transition-all hover:scale-105"
                >
                  <span className="text-primary">{feature.icon}</span>
                  <span className="text-sm font-semibold text-base-content">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Sub Description */}
            <p className="text-sm sm:text-base text-base-content/70 italic">
              {contributeText.subDesc}
            </p>

            {/* Optional GitHub Link */}
          {/* <Link
            href="https://github.com/SHABIN-K/Studydrive"
            target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-105"
          >
              <IconBrandGithub size={24} />
              <span>Contribute on Github</span>
          </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contribution;
