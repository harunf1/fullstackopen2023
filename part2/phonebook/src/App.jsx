import { useState, useEffect, useContext } from "react";
import Filter from "./components/Filter";
import Person from "./components/Persons";
import Addperson from "./components/PersonForm";
import adjustpeople from "./services/adjustpeople";
import Notifitcation from "./components/errormessage";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, seterrorMessage] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleNameChange = (event) => {
    setNewName(event.target.value.trim());
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value.trim());
  };

  useEffect(() => {
    adjustpeople.getPersons().then((people) => {
      setPersons(people);
    });
  }, []);

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addPerson = (event) => {
    event.preventDefault();

    if (!newName || !newNumber) {
      alert("Please enter a name and number before submitting.");
      return;
    }
    const normalizedNewName = newName.toLowerCase();

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === normalizedNewName
    );

    if (existingPerson) {
      if (
        window.confirm(
          `The name "${newName}" already exists. Would you like to update the number?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        adjustpeople
          .updatePerson(existingPerson.id, updatedPerson)
          .then((updatedPerson) => {
            setPersons((prevPersons) =>
              prevPersons.map((person) =>
                person.id === updatedPerson.id ? updatedPerson : person
              )
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            console.error("Error updating the person:", error);
            seterrorMessage(
              `The person "${existingPerson.name}" could not be updated. It has been removed from the server.`
            );
            setTimeout(() => seterrorMessage(null), 5000);
            // Refresh the state to ensure it's up-to-date
            adjustpeople.getPersons().then((updatedPersons) => {
              setPersons(updatedPersons);
            });
          });
      }
    } else {
      const PersonObject = {
        name: newName,
        number: newNumber,
      };

      adjustpeople.createPerson(PersonObject).then((personAdded) => {
        setPersons((prevPersons) => prevPersons.concat(personAdded));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const removePerson = (id) => {
    const personToDelete = persons.find((person) => person.id === id);

    if (!personToDelete) return; // Exit if person is not found in local state

    if (
      window.confirm(`Are you sure you want to delete ${personToDelete.name}?`)
    ) {
      adjustpeople
        .deletePerson(id)
        .then(() => {
          setPersons((prevPersons) =>
            prevPersons.filter((person) => person.id !== id)
          );
        })
        .catch((error) => {
          console.error("Error deleting the person:", error);
          seterrorMessage(
            `The person "${personToDelete.name}" has already been removed from the server.`
          );
          setPersons((prevPersons) =>
            prevPersons.filter((person) => person.id !== id)
          );
          setTimeout(() => seterrorMessage(null), 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notifitcation errorMessage={errorMessage} />
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
