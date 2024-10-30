import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
    const res = await apiRequest("/posts/" + params.id);
    return res.data;
};
export const listPageLoader = async ({ request, params }) => {
    const query = request.url.split("?")[1];
    const postPromise = apiRequest("/posts?" + query);
    return defer({
        postResponse: postPromise,
    });
};

export const profilePageLoader = async () => {
    // Pegando o usuário do localStorage para ter acesso ao ID
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser?.usuario?.id) {
        throw new Error("Usuário não autenticado");
    }

    const userId = currentUser.usuario.id;

    const postPromise = apiRequest(`/users/profilePosts/${userId}`);
    const chatPromise = apiRequest("/chats");

    return defer({
        postResponse: postPromise,
        chatResponse: chatPromise,
    });
};