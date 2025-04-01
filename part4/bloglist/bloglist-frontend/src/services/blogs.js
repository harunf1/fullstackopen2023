import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};

let token = null;
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const addBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = await axios.post(baseUrl, newBlog, config);
  return request.data;
};

export default { getAll, setToken, addBlog };
