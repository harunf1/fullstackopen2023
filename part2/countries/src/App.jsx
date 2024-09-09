import { useEffect, useState } from "react";
import Counrties from "./components/country";
import requests from "./services/requests";
import "./style/style.css";
function App() {
  const [countries, setCountries] = useState([]);
  const [fileteredCountries, setfiltertedCountries] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  useEffect(() => {
    requests.getCountries().then((initialCountries) => {
      setCountries(initialCountries);
    });
  }, []);

  const handlesearch = (event) => {
    const query = event.target.value;
    setsearchTerm(query);

    if (query) {
      const filtered = countries.filter((country) =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      );
      setfiltertedCountries(filtered);
    } else {
      setfiltertedCountries([]);
    }
  };

  const handleshowcountries = (name) => {
    const countryToShow = countries.filter((country) =>
      country.name.common.toLowerCase().includes(name.toLowerCase())
    );
    setfiltertedCountries(countryToShow);
  };

  return (
    <div className="container">
      <h1>Country Search</h1>
      <input
        className="search-box"
        type="text"
        placeholder="search for a country by name"
        value={searchTerm}
        onChange={handlesearch}
      ></input>
      <Counrties
        countries={fileteredCountries}
        handleshowcountries={handleshowcountries}
      />
    </div>
  );
}

export default App;
