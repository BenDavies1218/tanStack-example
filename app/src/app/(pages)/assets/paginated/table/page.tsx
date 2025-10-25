import Link from "next/link";

export default function MongoDBAssetsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← Back to Home
        </Link>
        <h1 className="mt-4 text-4xl font-bold">Asset Data Table (MongoDB)</h1>
        <p className="text-muted-foreground mt-2">
          Fetching data from MongoDB database using Mongoose and TanStack Query
        </p>
      </div>
    </div>
  );
}
