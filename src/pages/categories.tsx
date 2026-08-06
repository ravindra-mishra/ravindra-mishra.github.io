import Head from "next/head";
import { GetStaticProps } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Layout from "@/components/Layout";
import WebsiteMetaBundle from "@/components/meta/WebsiteMetaBundle";
import TitleBanner from "@/components/TitleBanner";
import CategoryCards from "@/components/categories/CategoryCards";
import {
  getCategoriesWithStats,
  type CategoryWithStats,
} from "@/lib/categories";
import { getAllBlogsSorted } from "@/lib/loadBlogs";
import config from "@/lib/config";

interface PageProps {
  categories: CategoryWithStats[];
  totalPosts: number;
}

const PAGE_TITLE = "Sitecore & .NET Blog Categories";
const PAGE_DESCRIPTION =
  "Browse Sitecore, SXA, XM Cloud, Marketplace, Azure DevOps, and Next.js article categories. Find practical developer tutorials grouped by topic.";

const CategoryPage: React.FC<PageProps> = ({ categories, totalPosts }) => {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${config.base_url}/categories`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categories.map((cat, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: cat.name,
        url: `${config.base_url}/categories/${cat.slug}`,
        description: cat.description,
      })),
    },
  };

  return (
    <Layout>
      <WebsiteMetaBundle
        path="/categories"
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      </Head>
      <TitleBanner title="Blog Categories" />
      <Breadcrumb />
      <div className="container">
        <div className="container-fluid blog-body-layout">
          <div className="blog-container page-content category-hub">
            <p className="category-hub-lead">
              Explore {totalPosts} technical articles on Sitecore XP, SXA, XM
              Cloud, Marketplace apps, Azure DevOps, and modern frontend
              development. Pick a category to jump into focused guides and
              real-world solutions.
            </p>

            <CategoryCards categories={categories} />

            <section className="category-hub-help" aria-labelledby="how-to-use">
              <h2 id="how-to-use">How to use these categories</h2>
              <ul>
                <li>
                  Start with{" "}
                  <Link href="/categories/sitecore">Sitecore</Link> for core
                  CMS tips, then go deeper with{" "}
                  <Link href="/categories/sitecore-sxa">SXA</Link> or{" "}
                  <Link href="/categories/sitecore-xm-cloud">XM Cloud</Link>.
                </li>
                <li>
                  Building Marketplace apps? Follow the{" "}
                  <Link href="/categories/sitecore-marketplace">
                    Sitecore Marketplace
                  </Link>{" "}
                  series and related{" "}
                  <Link href="/categories/nextjs-react-development">
                    Next.js / React
                  </Link>{" "}
                  posts.
                </li>
                <li>
                  Prefer a chronological feed? Visit the{" "}
                  <Link href="/blogs">full blog index</Link>.
                </li>
              </ul>
            </section>
          </div>

          <aside className="blog-side-container" aria-label="Quick links">
            <nav className="blog-toc" aria-label="Quick links">
              <p className="blog-toc-title">Quick links</p>
              <ol>
                <li className="level-2">
                  <Link href="/blogs">All articles</Link>
                </li>
                <li className="level-2">
                  <Link href="/about">About the author</Link>
                </li>
                <li className="level-2">
                  <Link href="/contact">Contact</Link>
                </li>
                <li className="level-2">
                  <Link href="/portfolio">Portfolio</Link>
                </li>
              </ol>
            </nav>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const categories = getCategoriesWithStats();
  const totalPosts = getAllBlogsSorted().length;

  return {
    props: {
      categories,
      totalPosts,
    },
  };
};
