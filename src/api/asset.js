import { upperFirst } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "../notifications/showNotification";
import api from "../api/index";

export const useGetAllAssetsQuery = (params) => {
  return useQuery({
    queryKey: ["assets", "all", params],
    queryFn: () => api.get("assets/all", { params }).then(({ data }) => data),
  });
};

export const useGetAssetsWithPaginationQuery = (params) => {
  return useQuery({
    queryKey: ["assets", params],
    queryFn: () => api.get("assets", { params }).then(({ data }) => data),
  });
};

export const useGetAssetByIdQuery = (assetId) => {
  return useQuery({
    queryKey: ["assets", assetId],
    queryFn: () => api.get(`assets/${assetId}`).then(({ data }) => data),
  });
};

/**
 * Cross-tab of the register: one bucket per `primaryGroup` value, each broken
 * down by `secondaryGroup`, with counts and purchase totals at every level.
 *
 * Both groups are asset field names — see ASSET_GROUP_FIELDS for the ones the
 * UI offers.
 */
export const useGetAssetsSummaryByGroupQuery = (params) => {
  return useQuery({
    queryKey: ["assets", "summary", "byGroup", params],
    queryFn: () => api.get("assets/summary/byGroup", { params }).then(({ data }) => data),
    enabled: Boolean(params?.primaryGroup && params?.secondaryGroup),
  });
};

export const useCreateAssetMutation = () => {
  const queryAsset = useQueryClient();

  return useMutation({
    mutationFn: (payload) => api.post("assets", payload),
    onSuccess: () => {
      queryAsset.invalidateQueries(["assets"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("asset successfully created"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error creating asset"),
        type: "error",
      }),
  });
};

export const useUpdateAssetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assetId, payload }) => api.patch(`assets/${assetId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["assets"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("asset successfully updated"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error updating asset"),
        type: "error",
      }),
  });
};

export const useDeleteAssetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assetId) => api.delete(`assets/${assetId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["assets"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("asset successfully deleted"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error deleting asset"),
        type: "error",
      }),
  });
};