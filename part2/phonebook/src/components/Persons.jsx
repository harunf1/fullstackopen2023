import React from "react";

const Person = (props) => {
  return (
    <ul>
      {props.person.map((persons) => {
        return (
          <li key={persons.name}>
            {persons.name} : {persons.number}
            <button>delete</button>
          </li>
        );
      })}
    </ul>
  );
};

export default Person;
