"use client";

//import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Burger from "./Burger";

import type { FC } from "react";
import Link from "next/link";

export interface NavigationProps {
  className?: string;
  isFooter?: boolean;
}

const Navigation: FC<NavigationProps> = ({ className, isFooter }) => {
  //const pathname = usePathname();
  const [active, setActive] = useState(false);
  useEffect(() => {
    const SCREEN_SM = 768; // Define the breakpoint (in pixels)

    const updateScrollLock = () => {
      if (window.innerWidth > SCREEN_SM) {
        // Remove scroll lock for screens larger than the breakpoint
        document.body.classList.remove("scroll-lock");
      } else if (active) {
        // Apply scroll lock for smaller screens when active
        document.body.classList.add("scroll-lock");
      } else {
        document.body.classList.remove("scroll-lock");
      }
    };

    // Run on mount and whenever 'active' changes
    updateScrollLock();

    // Attach a resize event listener to handle screen size changes
    window.addEventListener("resize", updateScrollLock);

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("scroll-lock");
      window.removeEventListener("resize", updateScrollLock);
    };
  }, [active]);

  return (
    <div>
      {!isFooter && (
        <Burger active={active} onClick={() => setActive(!active)} />
      )}
      <nav className={className + " " + (active ? "active" : "")}>
        <ul className="menu">
          <li>
            <Link href="/blogs" aria-label="Blogs">
              Blogs
            </Link>
          </li>
          <li>
            <Link href="/about" aria-label="About">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" aria-label="Contact">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/privacy" aria-label="Privacy Policy">
              Privacy Policy
            </Link>
          </li>
          {/* <li>
            <Link
              href="https://blogs.perficient.com/author/rmishra/"
              target="_blank"
              aria-label="Perficient Blogs"
            >
              Perficient Blogs
            </Link>
          </li> */}

          {/* <li className="footer-only">
            <Link
              href="https://github.com/ravindra-mishra"
              target="_blank"
              aria-label="GitHub Profile"
            >
              GitHub Profile
            </Link>
          </li>
          <li className="footer-only">
            <Link
              href="https://www.linkedin.com/in/mishra-ravindra/"
              target="_blank"
              aria-label="LinkedIn Profile"
            >
              LinkedIn Profile
            </Link>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
