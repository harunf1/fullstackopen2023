import { useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    console.log(event.target.value);
    setSearchTerm(event.target.value);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    if (!newName.trim()) {
      alert("Please enter a name before submitting.");
      return;
    }
    const normalizedNewName = newName.trim().toLowerCase();
    if (
      persons.some((person) => person.name.toLowerCase() === normalizedNewName)
    ) {
      alert(`The name ${newName} already exists in the phonebook.`);
      return;
    }
    if (!newNumber.trim()) {
      // Using trim() to also consider spaces as empty
      alert("Please enter a number before submitting.");
      return;
    }
    {
      const PersonObject = {
        name: newName,
        number: newNumber,
      };

      setPersons(persons.concat(PersonObject));
      setNewName("");
      setNewNumber("");
    }
  };
  return (
    <div>
      <h2>Phonebook</h2>

      <Addperson
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Person p={filteredPersons} />
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
    </div>
  );
};

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

const Addperson = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange} />
        Number:{" "}
        <input value={props.newNumber} onChange={props.handleNumberChange} />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default App;
