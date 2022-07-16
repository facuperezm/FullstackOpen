import React from "react";
import Weather from "./Weather";

const Country = ({ country, weatherList }) => {
  const capital = country.capital;
  console.log(weatherList);
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
      </div>
      <div>
        <h2>languages:</h2>
        <ul>
          {Object.entries(country.languages).map((key) => (
            <li key={key}>{key[1]}</li>
          ))}
        </ul>
        <img
          src={country.flags.png}
          alt="countryflag"
          height="100"
          width="200"
        />
        {capital ? <Weather capital={capital} /> : <p>Loading</p>}
      </div>
    </div>
  );
};

export default Country;
