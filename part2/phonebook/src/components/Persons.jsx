import React from "react";

const Person = (props) => {
  return (
    <ul>
      {props.person.map((persons) => {
        return (
          <li key={persons.id}>
            {persons.name} : {persons.number}
            <button
              onClick={() => {
                props.removePerson(persons.id);
              }}
            >
              delete
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Person;
