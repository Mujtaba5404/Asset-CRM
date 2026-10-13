import { useCallback, useMemo } from "react";
import { useGetAllAssetsQuery } from "../../api/asset";

/**
 * Resolves a depreciation's `asset` reference to the asset record. The API may
 * return it populated, as a bare id, or as null, so ids are looked up in the
 * "Get all assets" list — the same query <AssetSelect /> uses, so it reads from
 * that cache rather than fetching twice.
 */
const useAssetLookup = () => {
  const { data } = useGetAllAssetsQuery({ query: {} });

  const byId = useMemo(() => new Map((Array.isArray(data) ? data : []).map((asset) => [asset._id, asset])), [data]);

  return useCallback((asset) => {
    if (!asset) return null;
    if (typeof asset === "object") return asset;

    return byId.get(asset) ?? null;
  }, [byId]);
};

export default useAssetLookup;
