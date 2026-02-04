import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full mt-10 pt-6 pb-6 border-t border-base-content/10">
            <div className="w-full flex flex-col items-center gap-4">

                {/* Links */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-medium text-base-content/70">
                    <Link href="/about" className="hover:text-primary transition-colors">
                        About Us
                    </Link>
                    <Link href="/contact" className="hover:text-primary transition-colors">
                        Contact
                    </Link>
                    <Link href="/quicklinks" className="hover:text-primary transition-colors">
                        Quick Links
                    </Link>
                    <Link href="/privacypolicy" className="hover:text-primary transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="hover:text-primary transition-colors">
                        Terms & Conditions
                    </Link>
                </div>

                {/* Copyright/Branding */}
                <div className="text-center">
                    <p className="font-poppins text-sm md:text-base text-base-content/60">
                        LowStack.in | Crafted with ❤️ & Made In Basement 🏚️
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
