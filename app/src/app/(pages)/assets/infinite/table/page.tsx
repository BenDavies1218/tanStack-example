import Link from "next/link";

export default function PostgresAssetsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← Back to Home
        </Link>
        <h1 className="mt-4 text-4xl font-bold">
          Asset Data Table (PostgreSQL)
        </h1>
        <p className="text-muted-foreground mt-2">
          Fetching data from PostgreSQL database using Drizzle ORM and TanStack
          Query
        </p>
      </div>
    </div>
  );
}
