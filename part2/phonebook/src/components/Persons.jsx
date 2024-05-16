import React from "react";

const Person = (props) => {
  return (
    <ul>
      {props.p.map((persons) => {
        return (
          <li key={persons.name}>
            {persons.name} : {persons.number}
          </li>
        );
      })}
    </ul>
  );
};

export default Person;
