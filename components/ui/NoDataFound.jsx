/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";

const NoDataFound = () => {
  return (
    <section className="w-full py-12">
      <div className="max-w-md mx-auto flex flex-col items-center justify-center text-center px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full" />
          <Image
            src="/img/nodata.png"
            width={200}
            height={200}
            alt="No data found"
            className="relative w-[200px] md:w-[200px] object-contain"
            priority
          />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-base-content mb-4 tracking-tight">
          No Files Found <span className="text-primary">Yet</span>
        </h2>

        <p className="text-base-content/60 text-base mb-8 leading-relaxed">
          Be the first to help the community! Upload your notes or study materials and make a difference.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/dashboard"
            className="btn btn-primary rounded-full px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105"
          >
            Upload Now
          </Link>
          <Link
            href="/"
            className="btn btn-ghost rounded-full px-8 hover:bg-base-content/10"
          >
            Go Home
          </Link>
        </div>

        <div className="mt-10 p-4 rounded-2xl bg-base-200/50 border border-base-content/5 backdrop-blur-sm w-full">
          <p className="text-xs font-medium text-base-content/50 uppercase tracking-widest mb-2">Our Mission</p>
          <p className="text-sm text-base-content/80">
            Empowering students through peer-to-peer resource sharing. Your contribution fuels success!
          </p>
        </div>
      </div>
    </section>
  );
};
export default NoDataFound;
