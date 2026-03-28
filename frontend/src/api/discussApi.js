import API from "./axiosInstance";

export const getPosts = async () => {
    const response = await API.get("/discussions");
    return response.data;
};

export const createPost = async (postData) => {
    // postData: { title, content, problem_id? }
    const response = await API.post("/discussions", postData);
    return response.data;
};

export const addComment = async (postId, commentData) => {
    // commentData: { content, parent_comment_id? }
    const response = await API.post(`/discussions/${postId}/comments`, commentData);
    return response.data;
};
export const getComments = async (postId) => {
    const response = await API.get(`/discussions/${postId}/comments`);
    return response.data;
};
export const votePost = async (postId, commentId, voteType) => {
    const response = await API.post("/discussions/vote", { post_id: postId, comment_id: commentId, vote_type: voteType });
    return response.data;
};

export const bookmarkPost = async (postId) => {
    const response = await API.post(`/discussions/${postId}/bookmark`);
    return response.data;
};
export const deletePost = async (postId) => {
    const response = await API.delete(`/discussions/${postId}`);
    return response.data;
};

export const deleteComment = async (commentId) => {
    const response = await API.delete(`/discussions/comments/${commentId}`);
    return response.data;
};

export const getNotifications = async () => {
    const response = await API.get("/notifications");
    return response.data;
};

export const markNotificationRead = async (id) => {
    const response = await API.patch(`/notifications/${id}/read`);
    return response.data;
};
