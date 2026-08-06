"use client";



import { useEffect, useState, type FC, type MouseEvent } from "react";

import type { TocItem } from "@/lib/blogToc";



interface BlogTableOfContentsProps {

  items: TocItem[];

}



const BlogTableOfContents: FC<BlogTableOfContentsProps> = ({ items }) => {

  const [activeId, setActiveId] = useState<string>("");



  useEffect(() => {

    if (items.length === 0) return;



    const headings = items

      .map((item) => document.getElementById(item.id))

      .filter((el): el is HTMLElement => Boolean(el));



    if (headings.length === 0) return;



    const observer = new IntersectionObserver(

      (entries) => {

        const visible = entries

          .filter((e) => e.isIntersecting)

          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {

          setActiveId(visible[0].target.id);

        }

      },

      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5, 1] }

    );



    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();

  }, [items]);



  const onNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {

    const el = document.getElementById(id);

    if (!el) return;

    event.preventDefault();

    setActiveId(id);

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    window.history.replaceState(null, "", `#${id}`);

  };



  if (items.length < 2) return null;



  return (

    <nav className="blog-toc" aria-label="Table of contents">

      <p className="blog-toc-title">On this page</p>

      <ol>

        {items.map((item) => (

          <li key={item.id} className={`level-${item.level}`}>

            <a

              href={`#${item.id}`}

              className={activeId === item.id ? "is-active" : undefined}

              onClick={(e) => onNavClick(e, item.id)}

            >

              {item.text}

            </a>

          </li>

        ))}

      </ol>

    </nav>

  );

};



export default BlogTableOfContents;


