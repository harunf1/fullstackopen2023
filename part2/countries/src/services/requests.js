import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";
const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

const getCountries = () => {
  return axios
    .get(`${baseUrl}/all`)
    .then((response) => response.data)
    .catch((error) => {
      console.log("error fethcing all countries", error);
      throw error;
    });
};

const getCountriesByName = (name) => {
  return axios
    .get(`${baseUrl}/name/${name}`)
    .then((response) => response.data)
    .catch((error) => {
      console.log(`error fetching ${name}`, error);
      throw error;
    });
};

const getWeather = async (capital) => {
  try {
    const url = `${weatherBaseUrl}?q=${capital}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw new Error("Failed to fetch weather data");
  }
};

export default { getCountries, getCountriesByName, getWeather };
