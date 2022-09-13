import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import personService from "./services/personsdb";
import "./index.css";
import Notification from "./components/Notis";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [showAll, setShowAll] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((persons) => setPersons(persons));
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
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
    };
    const personToChange = persons.some((persons) => persons.name === newName);

    const oldName = persons.find((persons) => persons.name === newName);
    const NewPersona = { ...oldName, number: nameObject.number };

    if (personToChange) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(NewPersona.id, NewPersona)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) => {
                return persons.id !== NewPersona.id ? person : returnedPerson;
              })
            );
            setErrorMessage(`${newName} was MODIFIED`);
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setErrorMessage(`${newName} was already removed from server`);
            console.log(errorMessage);
            setPersons(
              persons.filter((persons) => NewPersona.id !== persons.id)
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
        return;
      }
    }
    personService
      .create(nameObject)
      .then((response) => {
        setPersons(persons.concat(nameObject));
        setNewName(" ");
        setNewNumber(" ");
        setErrorMessage(`${newName} was ADDED`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        console.log(response);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
        console.log(error.response.data.error);
        console.log("EROOORR");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const deletePerson = (pers, id) => {
    const nameObject = {
      name: newName,
      number: newNumber,
    };
    const oldName = persons.find((persons) => persons.name === newName);
    const NewPersona = { ...oldName, number: nameObject.number };
    if (window.confirm(`Delete ${pers} ?`)) {
      personService
        .remove(id)
        .then(() => {
          const newList = persons.filter((item) => item.id !== id);
          setPersons(newList);
        })
        .catch((error) => {
          setErrorMessage(`${pers} was already removed from server`);
          console.log(errorMessage);
          setPersons(persons.filter((persons) => NewPersona.id !== persons.id));
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    } else {
      return;
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
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
      <Persons
        persons={persons}
        showAll={showAll}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
