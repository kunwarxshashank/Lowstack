import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Image from "next/image";

const SocialLinks = ({
  githubUsername,
  xUsername,
  linkedinUsername,
  instagramUsername,
}) => {
  return (
    <div className="flex justify-center gap-2">
      {githubUsername && (
        <SocialLink
          icon={<IconBrandGithub size={20} />}
          tooltip="Github"
          url={`https://github.com/${githubUsername}`}
        />
      )}
      {xUsername && (
        <SocialLink
          icon={<IconBrandX size={20} />}
          tooltip="twitter"
          url={`https://twitter.com/${xUsername}`}
        />
      )}
      {linkedinUsername && (
        <SocialLink
          icon={<IconBrandLinkedin size={20} />}
          tooltip="Linkedin"
          url={`https://www.linkedin.com/in/${linkedinUsername}`}
        />
      )}
      {instagramUsername && (
        <SocialLink
          icon={<IconBrandInstagram size={20} />}
          tooltip="Instagram"
          url={`https://www.instagram.com/${instagramUsername}`}
        />
      )}
    </div>
  );
};

const SocialLink = ({ icon, tooltip, url }) => {
  return (
    <Link
      className="p-2 rounded-full bg-base-content/5 hover:bg-gradient-to-br hover:from-primary hover:to-secondary text-base-content hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg tooltip tooltip-bottom"
      data-tip={tooltip}
      href={url}
      target="_blank"
    >
      {icon}
    </Link>
  );
};

const Team = () => {
  const teamMembers = [
    {
      name: "Kunwar Shashank Mishra",
      role: "Team lead | Creator",
      img: "/team/kunwarxshashank.jpeg",
      githubUsername: "kunwarxshashank",
      linkedinUsername: "kunwarxshashank",
    },
    {
      name: "Naveen Kumar",
      role: "Content Head",
      img: "/team/naveen.jpeg",
      githubUsername: "nvnkr",
      linkedinUsername: "nvnkr2005",
    },
    {
      name: "Prateek Barsagade",
      role: "Contributor",
      img: "/team/prateek.jpeg",
      linkedinUsername: "prateek-barsagade",
    },
    {
      name: "Harshit Soni",
      role: "Contributor",
      img: "/team/harshit.jpeg",
      linkedinUsername: "harshit-soni-760961291",
    },
    {
      name: "Nikhil Kumar",
      role: "Contributor",
      img: "/team/nikhil.jpeg",
      linkedinUsername: "nikhil-kumar-a1a226295",
    }
  ];

  return (
    <div className="px-4 py-8 mx-auto">
      {/* Section Header */}
      <div className="mx-auto mb-12 text-center">
        <div className="inline-block">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-3">
            Meet the Team
          </h2>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-primary via-secondary to-accent rounded-full"></div>
        </div>
        <p className="text-base-content/70 mt-4 text-sm sm:text-base">
          The amazing people behind LowStack
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid gap-4 sm:gap-5 md:gap-6 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, index) => {
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-base-100 to-base-200 border border-base-content/10 hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] p-6"
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-300"></div>
              
              <div className="relative flex flex-col items-center text-center space-y-4">
                {/* Avatar with Ring */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-primary/20 group-hover:ring-primary/40 overflow-hidden transition-all duration-300 group-hover:scale-110">
              <Image
                      className="object-cover w-full h-full"
                width={500}
                height={500}
                src={member.img}
                      alt={member.name}
                    />
                  </div>
                  {/* Status Dot */}
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-base-100"></div>
                </div>

                {/* Member Info */}
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-base-content group-hover:text-primary transition-colors capitalize">
                  {member.name}
                  </h3>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                    <p className="text-xs sm:text-sm text-primary font-semibold tracking-tight">
                  {member.role}
                </p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-2">
                <SocialLinks {...member} />
                </div>
              </div>

              {/* Bottom Gradient Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
