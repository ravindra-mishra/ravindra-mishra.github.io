import Link from "next/link";
import { useRouter } from "next/router";

interface BreadcrumbProps {
  className?: string; // Optional className prop
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ className }) => {
  const router = useRouter();
  const pathSegments = router.asPath.split("?")[0].split("/").filter(Boolean);

  const buildBreadcrumbs = () => {
    const breadcrumbs = pathSegments.map((segment, index) => {
      const path = "/" + pathSegments.slice(0, index + 1).join("/");
      const label = segment.replace(/-/g, " "); // Format segment to readable text

      // Check if slug logic applies, e.g., fetch a mapping for the segment
      const slugMapping: Record<string, string> = {
        "example-slug": "Example Page",
        "another-slug": "Another Page",
      };

      const finalLabel = slugMapping[segment] || label;

      return { path, label: finalLabel };
    });

    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  return (
    <div className={`breadcrumb ${className}`}>
      <div className="container">
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb-item-list">
            <li className="breadcrumb-item">
              <Link href="/" aria-label="Home">
                home
              </Link>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <li
                key={index}
                className={`breadcrumb-item ${
                  index === breadcrumbs.length - 1 ? "active" : ""
                }`}
                aria-current={
                  index === breadcrumbs.length - 1 ? "page" : undefined
                }
              >
                {index === breadcrumbs.length - 1 ? (
                  crumb.label
                ) : (
                  <Link href={crumb.path} aria-label={crumb.label}>
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;

// CSS Styles (Optional, use a CSS or Tailwind framework for better design)
<style jsx>{`
  .breadcrumb {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .breadcrumb-item-list {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 10px;
  }

  .breadcrumb-item {
    margin-right: 0.5rem;
  }

  .breadcrumb-item a {
    text-decoration: none;
  }

  .breadcrumb-item.active {
    color: gray;
  }
`}</style>;
