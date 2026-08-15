import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

// Automatically attach Access Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


// Automatically refresh Access Token when it expires
api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        // If access token expired
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");

                window.location.href = "/login";

                return Promise.reject(error);
            }

            try {
                // Ask Django for a new access token
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/token/refresh/",
                    {
                        refresh: refreshToken,
                    }
                );

                const newAccessToken = response.data.access;

                // Save new access token
                localStorage.setItem("accessToken", newAccessToken);

                // Because ROTATE_REFRESH_TOKENS is enabled,
                // Django may also return a new refresh token.
                if (response.data.refresh) {
                    localStorage.setItem(
                        "refreshToken",
                        response.data.refresh
                    );
                }

                // Retry the original request
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {
                // Refresh token is also invalid/expired
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");

                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;