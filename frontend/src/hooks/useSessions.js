// import { useMutation, useQuery } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { sessionApi } from "../api/sessions";

// export const useCreateSession = () => {
//   const result = useMutation({
//     mutationKey: ["createSession"],
//     mutationFn: sessionApi.createSession,
//     onSuccess: () => toast.success("Session created successfully!"),
//     onError: (error) => toast.error(error.response?.data?.message || "Failed to create room"),
//   });

//   return result;
// };

// export const useActiveSessions = () => {
//   const result = useQuery({
//     queryKey: ["activeSessions"],
//     queryFn: sessionApi.getActiveSessions,
//   });

//   return result;
// };

// export const useMyRecentSessions = () => {
//   const result = useQuery({
//     queryKey: ["myRecentSessions"],
//     queryFn: sessionApi.getMyRecentSessions,
//   });

//   return result;
// };

// export const useSessionById = (id) => {
//   const result = useQuery({
//     queryKey: ["session", id],
//     queryFn: () => sessionApi.getSessionById(id),
//     enabled: !!id,
//     refetchInterval: 5000, // refetch every 5 seconds to detect session status changes
//   });

//   return result;
// };

// export const useJoinSession = () => {
//   const result = useMutation({
//     mutationKey: ["joinSession"],
//     mutationFn: sessionApi.joinSession,
//     onSuccess: () => toast.success("Joined session successfully!"),
//     onError: (error) => toast.error(error.response?.data?.message || "Failed to join session"),
//   });

//   return result;
// };

// export const useEndSession = () => {
//   const result = useMutation({
//     mutationKey: ["endSession"],
//     mutationFn: sessionApi.endSession,
//     onSuccess: () => toast.success("Session ended successfully!"),
//     onError: (error) => toast.error(error.response?.data?.message || "Failed to end session"),
//   });

//   return result;
// };






import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";
import { useAuth } from "@clerk/clerk-react";

export const useCreateSession = () => {
  const { getToken } = useAuth();

  return useMutation({
    mutationKey: ["createSession"],
    mutationFn: async (data) => {
      const token = await getToken();
      return sessionApi.createSession(data, token);
    },
    onSuccess: () => toast.success("Session created successfully!"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to create room"),
  });
};

export const useActiveSessions = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["activeSessions"],
    queryFn: async () => {
      const token = await getToken();
      return sessionApi.getActiveSessions(token);
    },
  });
};

export const useMyRecentSessions = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: async () => {
      const token = await getToken();
      return sessionApi.getMyRecentSessions(token);
    },
  });
};

export const useSessionById = (id) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["session", id],
    queryFn: async () => {
      const token = await getToken();
      return sessionApi.getSessionById(id, token);
    },
    enabled: !!id,
    refetchInterval: 5000,
  });
};

export const useJoinSession = () => {
  const { getToken } = useAuth();

  return useMutation({
    mutationKey: ["joinSession"],
    mutationFn: async (id) => {
      const token = await getToken();
      return sessionApi.joinSession(id, token);
    },
    onSuccess: () => toast.success("Joined session successfully!"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to join session"),
  });
};

export const useEndSession = () => {
  const { getToken } = useAuth();

  return useMutation({
    mutationKey: ["endSession"],
    mutationFn: async (id) => {
      const token = await getToken();
      return sessionApi.endSession(id, token);
    },
    onSuccess: () => toast.success("Session ended successfully!"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to end session"),
  });
};
