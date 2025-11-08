import Link from "next/link";
import { type ReactNode } from "react";

export interface PageContainerProps {
  children: ReactNode;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  className?: string;
  headerContent?: ReactNode;
}

/**
 * PageContainer - Standardized page layout component
 *
 * Provides consistent layout across all pages with:
 * - Back navigation link
 * - Page title and description
 * - Responsive container with max-width
 * - Optional custom header content
 *
 * @param title - Page title (required)
 * @param description - Optional page description
 * @param backHref - Back link URL (defaults to "/")
 * @param backLabel - Back link text (defaults to "← Back to Home")
 * @param className - Additional CSS classes for the container
 * @param headerContent - Optional additional content to render after title/description
 * @param children - Page content
 */
const PageContainer = ({
  children,
  title,
  description,
  backHref = "/",
  backLabel = "← Back to Home",
  className = "",
  headerContent,
}: PageContainerProps) => {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#026d2f] to-[#15162c] text-white">
      <div className={`mx-auto max-w-6xl p-6 ${className}`}>
        {/* Back Navigation */}
        <Link
          href={backHref}
          className="mb-6 inline-block text-sm text-green-300 hover:text-green-400"
        >
          {backLabel}
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">{title}</h1>
          {description && (
            <p className="text-lg text-gray-300">{description}</p>
          )}
        </div>

        {/* Optional Header Content */}
        {headerContent && <div className="mb-8">{headerContent}</div>}

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
