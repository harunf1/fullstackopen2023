import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Person from "./components/Persons";
import Addperson from "./components/PersonForm";
import adjustpeople from "./services/adjustpeople";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    adjustpeople.getPersons().then((people) => {
      setPersons(people);
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNameChange = (event) => {
    setNewName(event.target.value.trim());
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value.trim());
  };

  const addPerson = (event) => {
    event.preventDefault();
    if (!newName) {
      alert("Please enter a name before submitting.");
      return;
    }
    const normalizedNewName = newName.toLowerCase();
    if (
      persons.some((person) => person.name.toLowerCase() === normalizedNewName)
    ) {
      alert(`The name ${newName} already exists in the phonebook.`);
      return;
    }
    if (!newNumber) {
      alert("Please enter a number before submitting.");
      return;
    }

    const PersonObject = {
      name: newName,
      number: newNumber,
    };

    adjustpeople.createPerson(PersonObject).then((personadded) => {
      setPersons((prevPersons) => prevPersons.concat(personadded));
      setNewName("");
      setNewNumber("");
    });
  };

  const removePerson = (id) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      adjustpeople
        .deletePerson(id)
        .then(() => {
          setPersons((prevPersons) =>
            prevPersons.filter((person) => person.id !== id)
          );
        })
        .catch((error) => {
          console.error("There was an error deleting the person!", error);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Addperson
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Person person={filteredPersons} removePerson={removePerson} />
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
    </div>
  );
};

export default App;
