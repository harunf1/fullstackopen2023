import axios from "axios";
const baseUrl = "/api/persons";

const getPersons = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createPerson = (newperson) => {
  const request = axios.post(baseUrl, newperson);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};
const updatePerson = (id, updatedPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedPerson);
  return request.then((response) => response.data);
};
export default {
  getPersons,
  createPerson,
  deletePerson,
  updatePerson,
};
