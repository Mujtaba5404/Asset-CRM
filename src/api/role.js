import { upperFirst } from "@mantine/hooks";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "../notifications/showNotification";
import api from "../api/index";

export const useGetAllRolesQuery = () => {
  return useQuery({
    queryKey: ["roles", "all"],
    queryFn: () => api.get("roles/all").then(({ data }) => data),
  });
};

export const useGetRolesWithPaginationQuery = (params) => {
  return useQuery({
    queryKey: ["roles", "paginated", params],
    queryFn: () => api.get("roles", { params }).then(({ data }) => data),
    placeholderData: keepPreviousData,
  });
};

export const useGetRoleByIdQuery = (roleId) => {
  return useQuery({
    queryKey: ["roles", "detail", roleId],
    queryFn: () => api.get(`roles/${roleId}`).then(({ data }) => data),
    enabled: !!roleId,
  });
};

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => api.post("roles", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("role successfully created"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error creating role"),
        type: "error",
      }),
  });
};

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, payload }) => api.patch(`roles/${roleId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("role successfully updated"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error updating role"),
        type: "error",
      }),
  });
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId) => api.delete(`roles/${roleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("role successfully deleted"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error deleting role"),
        type: "error",
      }),
  });
};
