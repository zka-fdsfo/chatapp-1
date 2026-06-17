import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessageApi } from "../services/auth.api";

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId) => deleteMessageApi(messageId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};