import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState("");
  const api_key = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`
      )
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        console.log("Request canceled", error.message);
        throw error;
      });
  }, [api_key, capital]);
  console.log(weather);

  if (weather) {
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <p>temperature {weather.main.temp} Celsius</p>
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="climate"
        ></img>
        <p>wind {weather.wind.speed} m/s</p>
      </div>
    );
  } else {
    return <div>loading...</div>;
  }
};

export default Weather;
