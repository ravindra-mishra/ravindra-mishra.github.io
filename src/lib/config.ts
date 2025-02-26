import config from "../../content/config.json";

export interface Config {
  readonly base_url: string;
  readonly site_title: string;
  readonly site_description: string;
  readonly site_keywords: string[];
  readonly posts_per_page: number;
  readonly twitter_account: string;
  readonly github_account: string;
}

// Override `base_url` with the environment variable if available
const updatedConfig: Config = {
  ...config,
  base_url: process.env.NEXT_PUBLIC_BASE_URL || config.base_url, // Fallback to JSON value if not set
};

export default updatedConfig;
