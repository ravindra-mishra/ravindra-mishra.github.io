"use client";

import { useEffect, useState } from "react";
import Burger from "./Burger";

import type { FC } from "react";
import Link from "next/link";

export interface NavigationProps {
  className?: string;
  isFooter?: boolean;
}

const Navigation: FC<NavigationProps> = ({ className, isFooter }) => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const SCREEN_SM = 768;

    const updateScrollLock = () => {
      if (window.innerWidth > SCREEN_SM) {
        document.body.classList.remove("scroll-lock");
      } else if (active) {
        document.body.classList.add("scroll-lock");
      } else {
        document.body.classList.remove("scroll-lock");
      }
    };

    updateScrollLock();
    window.addEventListener("resize", updateScrollLock);

    return () => {
      document.body.classList.remove("scroll-lock");
      window.removeEventListener("resize", updateScrollLock);
    };
  }, [active]);

  return (
    <div className={isFooter ? undefined : "header-nav-wrap"}>
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
            <Link href="/categories" aria-label="Categories">
              Categories
            </Link>
          </li>
          <li>
            <Link href="/portfolio" aria-label="Portfolio">
              Portfolio
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
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
