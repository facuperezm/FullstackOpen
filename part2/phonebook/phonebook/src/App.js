import { useState } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [showAll, setShowAll] = useState("");

  const handleNameChange = (event) => {
    const checkPerson = persons.find(
      (person) => person.name === event.target.value
    );
    checkPerson !== undefined
      ? alert(`${newName} is already on phonebook`)
      : setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    const checkPerson = persons.find(
      (person) => person.name === event.target.value
    );
    checkPerson !== undefined
      ? alert(`${newName} is already on phonebook`)
      : setNewNumber(event.target.value);
  };

  const handleFilter = (event) => {
    setShowAll(event.target.value);
  };

  const addName = (event) => {
    event.preventDefault();
    const nameObject = {
      name: newName,
      number: newNumber,
      key: persons,
    };
    setPersons(persons.concat(nameObject));
    setNewName(" ");
    setNewNumber(" ");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter showAll={showAll} handleFilter={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newNumber={newNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} showAll={showAll} />
    </div>
  );
};

export default App;
