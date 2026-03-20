import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import React from "react";
import { GetStaticProps } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import IntroContent from "@/components/IntroContent";
import Layout from "@/components/Layout";
import BasicMeta from "@/components/meta/BasicMeta";
import JsonLdMetaWebsite from "@/components/meta/JsonLdMetaWebsite";
import OpenGraphMeta from "@/components/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/meta/TwitterCardMeta";
import TitleBanner from "@/components/TitleBanner";
import Link from "next/link";

interface Tags {
  slug: string;
  name: string;
}

interface PageProps {
  tags: Tags[];
}

const CategoryPage: React.FC<PageProps> = ({ tags }) => {
  return (
    <Layout>
      <BasicMeta
        url={"/categories"}
        title="Blog Categories"
        description="Browse all available blog categories on this website. Discover articles grouped by topics and explore content that interests you."
      />
      <OpenGraphMeta
        url={"/categories"}
        title="Blog Categories"
        description="Browse all available blog categories on this website. Discover articles grouped by topics and explore content that interests you."
      />
      <TwitterCardMeta
        url={"/categories"}
        title="Blog Categories"
        description="Browse all available blog categories on this website. Discover articles grouped by topics and explore content that interests you."
      />
      <JsonLdMetaWebsite
        url={"/categories"}
        title="Blog Categories"
        description="Browse all available blog categories on this website. Discover articles grouped by topics and explore content that interests you."
      />
      <TitleBanner title="Blog Categories" />
      <Breadcrumb />
      <div className="container">
        <div className="container-fluid">
          <div className="main-container">
            <div>
              <ul>
                {tags.map((tag) => (
                  <li key={tag.slug}>
                    <Link href={`/categories/${tag.slug}`}>{tag.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="side-container">
            <IntroContent className="remove-top-margin" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;

export const getStaticProps: GetStaticProps = async () => {
  const tagsPath = path.resolve(process.cwd(), "./content/meta/tags.yml");
  const tagsFile = fs.readFileSync(tagsPath, "utf8");

  const data = yaml.load(tagsFile) as { tags: Tags[] };
  const tags: Tags[] = data.tags;
  return {
    props: {
      tags,
    },
  };
};
