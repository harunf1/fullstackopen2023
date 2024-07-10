import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Person from "./components/Persons";
import Addperson from "./components/PersonForm";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);

  const getPeople = () => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
      console.log(response.data);
    });
  };

  useEffect(getPeople, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
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

      const request = axios.post(`http://localhost:3001/persons`, PersonObject);
      setPersons(persons.concat(PersonObject));
      setNewName("");
      setNewNumber("");
      return request.then((response) => response.data);
    }
  };

  const deletePerson = (id) => {
    console.log(`just removed ${id}`);
    const request = axios.delete(`http://localhost:3001/${id}`);
    return request.then((response) => response.data);
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
      <Person person={filteredPersons} />
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
    </div>
  );
};

export default App;
