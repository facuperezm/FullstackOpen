import { useState, useEffect } from "react";
import axios from "axios";
import Display from "./components/Display";

const App = () => {
  const [newCountry, setCountry] = useState([]);
  const [showAll, setShowAll] = useState("");

  useEffect(() => {
    console.log("effect");
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        setCountry(response.data);
        console.log("promise fulfilled");
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSearch = (event) => {
    setShowAll(event.target.value);
  };

  const countries = newCountry.filter((countries) =>
    countries.name.common.toLowerCase().includes(showAll.toLowerCase())
  );

  return (
    <div>
      <p>
        find countries <input value={showAll} onChange={handleSearch} />
      </p>
      <Display countries={countries} setShowAll={setShowAll} />
    </div>
  );
};
export default App;
