import axios from "axios";

const deviceId = localStorage.getItem("deviceId");

export const getDataAPI = async (url, token) => {
  try {
    const res = await axios.get(`/api/${url}`, {
      headers: { Authorization: token, deviceId: deviceId },
    });

    return res;
  } catch (err) {
    if (
      err?.response?.status === 403 &&
      err?.response?.data?.type === "ACCESS_DENIED"
    ) {
      setTimeout(() => {
        localStorage.removeItem("firstLogin");
        window.location.href = "/";
      }, 3000);
    }

    throw err;
  }
};

export const postDataAPI = async (url, post, token) => {
  try {
    const res = await axios.post(`/api/${url}`, post, {
      headers: { Authorization: token, deviceId: deviceId },
    });
    return res;
  } catch (err) {
    // Handle block device access
    if (
      err.response?.status === 403 &&
      err.response?.data?.type === "ACCESS_DENIED"
    ) {
      setTimeout(() => {
        localStorage.removeItem("firstLogin");
        window.location.href = "/";
      }, 3000);
    }

    throw err;
  }
};

export const putDataAPI = async (url, post, token) => {
  try {
    const res = await axios.put(`/api/${url}`, post, {
      headers: { Authorization: token, deviceId: deviceId },
    });
    return res;
  } catch (err) {
    // Handle block device access
    if (
      err.response?.status === 403 &&
      err.response?.data?.type === "ACCESS_DENIED"
    ) {
      setTimeout(() => {
        localStorage.removeItem("firstLogin");
        window.location.href = "/";
      }, 3000);
    }
    throw err;
  }
};

export const patchDataAPI = async (url, post, token) => {
  try {
    const res = await axios.patch(`/api/${url}`, post, {
      headers: { Authorization: token, deviceId: deviceId },
    });
    return res;
  } catch (err) {
    // Handle block device access
    if (
      err.response?.status === 403 &&
      err.response?.data?.type === "ACCESS_DENIED"
    ) {
      setTimeout(() => {
        localStorage.removeItem("firstLogin");
        window.location.href = "/";
      }, 3000);
    }

    throw err;
  }
};

export const deleteDataAPI = async (url, token) => {
  try {
    const res = await axios.delete(`/api/${url}`, {
      headers: { Authorization: token, deviceId: deviceId },
    });
    return res;
  } catch (err) {
    // Handle block device access
    if (
      err.response?.status === 403 &&
      err.response?.data?.type === "ACCESS_DENIED"
    ) {
      setTimeout(() => {
        localStorage.removeItem("firstLogin");
        window.location.href = "/";
      }, 3000);
    }

    throw err;
  }
};
