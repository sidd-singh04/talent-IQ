// import axiosInstance from "../lib/axios";

// export const sessionApi = {
//   createSession: async (data) => {
//     const response = await axiosInstance.post("/sessions", data);
//     return response.data;
//   },

//   getActiveSessions: async () => {
//     const response = await axiosInstance.get("/sessions/active");
//     return response.data;
//   },
//   getMyRecentSessions: async () => {
//     const response = await axiosInstance.get("/sessions/my-recent");
//     return response.data;
//   },

//   getSessionById: async (id) => {
//     const response = await axiosInstance.get(`/sessions/${id}`);
//     return response.data;
//   },

//   joinSession: async (id) => {
//     const response = await axiosInstance.post(`/sessions/${id}/join`);
//     return response.data;
//   },
//   endSession: async (id) => {
//     const response = await axiosInstance.post(`/sessions/${id}/end`);
//     return response.data;
//   },
//   getStreamToken: async () => {
//     const response = await axiosInstance.get(`/chat/token`);
//     return response.data;
//   },
// };




import axiosInstance from "../lib/axios";

export const sessionApi = {
  createSession: async (data, token) => {
    const response = await axiosInstance.post(
      "/sessions",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getActiveSessions: async (token) => {
    const response = await axiosInstance.get("/sessions/active", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getMyRecentSessions: async (token) => {
    const response = await axiosInstance.get("/sessions/my-recent", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getSessionById: async (id, token) => {
    const response = await axiosInstance.get(`/sessions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  joinSession: async (id, token) => {
    const response = await axiosInstance.post(
      `/sessions/${id}/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  endSession: async (id, token) => {
    const response = await axiosInstance.post(
      `/sessions/${id}/end`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getStreamToken: async (token) => {
    const response = await axiosInstance.get("/chat/token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
