import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [allNames, setAll] = useState(true);

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const addName = (event) => {
    event.preventDefault();
    const nameObject = {
      name: newName,
      key: persons,
    };
    setPersons(persons.concat(nameObject));
    setNewName(" ");
    console.log(persons);
  };

  const notesToShow = allNames ? persons : persons;

  return (
    <div>
      <h2>Phonebook</h2>

      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {persons.map((persons) => {
        return <li key={persons.name}>{persons.name}</li>;
      })}
    </div>
  );
};

export default App;
