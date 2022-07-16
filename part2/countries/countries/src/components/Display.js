import React from "react";
import Country from "./Country";

const Display = ({ countries, setShowAll }) => {
  const country = countries[0];

  if (countries.length === 1) {
    return <Country country={country} />;
  } else if (countries.length >= 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length <= 10) {
    return (
      <div>
        {countries.map((country, id) => (
          <div key={id}>
            <p key={id}>
              {country.name.common}
              <button
                value={country.name.common}
                onClick={(e) => setShowAll(e.target.value)}
              >
                show
              </button>
            </p>
          </div>
        ))}
      </div>
    );
  }
};

export default Display;
