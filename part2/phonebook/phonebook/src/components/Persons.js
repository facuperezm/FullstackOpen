import React from "react";

const Persons = ({ persons, showAll }) => {
  return (
    <div>
      {showAll
        ? persons
            .filter((persons) =>
              persons.name.toLowerCase().includes(showAll.toLowerCase())
            )
            .map((persons) => (
              <p key={persons.name}>
                {persons.name} {persons.number}
              </p>
            ))
        : persons.map((persons) => (
            <p key={persons.name}>
              {persons.name} {persons.number}
            </p>
          ))}
    </div>
  );
};

export default Persons;
