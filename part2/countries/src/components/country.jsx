import React from "react";
import { useEffect, useState } from "react";
import "../style/style.css";
import requests from "../services/requests";
const Countries = ({ countries, handleshowcountries }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (countries.length === 1) {
      const capital = countries[0].capital;
      if (capital) {
        requests
          .getWeather(capital)
          .then((data) => {
            setWeather(data);
            setError(null);
          })
          .catch((error) => {
            console.error("Error fetching weather data:", error);
            setError("Failed to fetch weather data. Please try again later.");
          });
      }
    }
  }, [countries]);

  if (countries.length > 10) {
    return <p>too many matches , keep typing cheif</p>;
  } else if (countries.length > 1) {
    return (
      <ul>
        {countries.map((country) => (
          <li key={country.name.common}>
            {country.name.common}
            <button
              className="show-button"
              onClick={() => handleshowcountries(country.name.common)}
            >
              show
            </button>
          </li>
        ))}
      </ul>
    );
  } else if (countries.length == 1) {
    const country = countries[0];
    return (
      <div className="container">
        <h2>{country.name.common}</h2>
        <p>Capital City:{country.capital}</p>
        <p>Area: {country.area}</p>
        <h3>Languages:</h3>
        <ul>
          {" "}
          {Object.values(country.languages).map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
        <img className="flag" src={country.flags.svg}></img>

        <div className="weather-info">
          <h3>Weather in {country.capital}</h3>
          {weather ? (
            <>
              <p>Weather: {weather.weather[0].description}</p>
              <p>Temperature: {Math.round(weather.main.temp - 273.15)}°C</p>
              <p>Wind: {weather.wind.speed} km/h</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                alt={weather.weather[0].description}
                className="weather-icon"
              />
            </>
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>
      </div>
    );
  }
};

export default Countries;
