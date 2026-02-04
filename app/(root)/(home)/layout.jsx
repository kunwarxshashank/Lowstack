import { Navbar, Sidebar } from "@/components/navigation";
import Footer from "@/components/Footer";

export default function HomeLayout({ children }) {
  return (
    <section>
      <div className="relative sm:p-8 p-4  flex flex-row">
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>
        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <Navbar />
          {children}
          <Footer />
        </div>
      </div>
    </section>
  );
}
