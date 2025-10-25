import { api } from "@/trpc/react";
import type { RouterInputs } from "@/trpc/react";

/**
 * TanStack Query wrapper hooks for asset operations
 */

type AssetListInput = RouterInputs["asset"]["listPostgres"];

/**
 * Fetch assets from PostgreSQL with pagination and filtering
 */
export function usePostgresAssets(params: AssetListInput) {
  return api.asset.listPostgres.useQuery(params);
}

/**
 * Fetch assets from MongoDB with pagination and filtering
 */
export function useMongoAssets(params: AssetListInput) {
  return api.asset.listMongo.useQuery(params);
}
