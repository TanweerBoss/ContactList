import React, { useState, useEffect } from 'react'; /*Importing dependencies*/
import axios from 'axios'; // Importing axios for HTTP requests
import './App.css'; // Importing CSS file for styling

const ContactList = () => { // Defining the ContactList component
  const [contacts, setContacts] = useState([]); // State variable for storing contacts
  const [name, setName] = useState(''); // State variable for storing name input value
  const [email, setEmail] = useState(''); // State variable for storing email input value
  const [editId, setEditId] = useState(null); // State variable for storing the ID of the contact being edited
  const [editName, setEditName] = useState(''); // State variable for storing the updated name value during editing
  const [editEmail, setEditEmail] = useState(''); // State variable for storing the updated email value during editing

  useEffect(() => { // Fetching initial contact data
    axios
      .get('https://jsonplaceholder.typicode.com/users') // Making a GET request to retrieve contacts
      .then((response) => {
        setContacts(response.data); // Updating contacts state with the fetched data
      })
      .catch((error) => {
        console.log(error); // Logging an error, if any
      });
  }, []);

  const handleNameChange = (event) => { // Event handler for name input change
    setName(event.target.value); // Updating name state with the input value
  };

  const handleEmailChange = (event) => { // Event handler for email input change
    setEmail(event.target.value); // Updating email state with the input value
  };

  const handleSubmit = (event) => { // Event handler for form submission (adding a contact)
    event.preventDefault(); // Preventing the default form submission behavior

    const newContact = { // Creating a new contact object
      name: name, // Setting the name property from the name state
      email: email, // Setting the email property from the email state
    };

    axios
      .post('https://jsonplaceholder.typicode.com/users', newContact) // Making a POST request to add the contact
      .then((response) => {
        const updatedContacts = [...contacts, response.data]; // Adding the new contact to the contacts list
        setContacts(updatedContacts); // Updating contacts state with the updated list
        setName(''); // Resetting the name state
        setEmail(''); // Resetting the email state
      })
      .catch((error) => {
        console.log(error); // Logging an error, if any
      });
  };

  // Event handlers for editing a contact
  const handleEdit = (id, currentName, currentEmail) => { // Event handler for initiating edit mode
    setEditId(id); // Setting the ID of the contact being edited
    setEditName(currentName); // Setting the current name value for editing
    setEditEmail(currentEmail); // Setting the current email value for editing
  };

  const handleEditNameChange = (event) => { // Event handler for edited name input change
    setEditName(event.target.value); // Updating the edited name value
  };

  const handleEditEmailChange = (event) => { // Event handler for edited email input change
    setEditEmail(event.target.value); // Updating the edited email value
  };

  const handleEditSubmit = (event) => { // Event handler for submitting edited contact
    event.preventDefault(); // Preventing the default form submission behavior

    const updatedContact = { // Creating an updated contact object
      id: editId, // Setting the ID of the contact being edited
      name: editName, // Setting the updated name value
      email: editEmail, // Setting the updated email value
    };

    axios
      .put(`https://jsonplaceholder.typicode.com/users/${editId}`, updatedContact) // Making a PUT request to update the contact
      .then(() => {
        const updatedContacts = contacts.map((contact) =>
          contact.id === editId ? { ...contact, name: editName, email: editEmail } : contact
        ); // Updating the specific contact with the edited values
        setContacts(updatedContacts); // Updating contacts state with the updated list
        setEditId(null); // Clearing the edit ID
        setEditName(''); // Clearing the edit name
        setEditEmail(''); // Clearing the edit email
      })
      .catch((error) => {
        console.log(error); // Logging an error, if any
      });
  };

  const handleDelete = (id) => { // Event handler for deleting a contact
    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${id}`) // Making a DELETE request to delete the contact
      .then(() => {
        const updatedContacts = contacts.filter((contact) => contact.id !== id); // Removing the contact from the contacts list
        setContacts(updatedContacts); // Updating contacts state with the updated list
      })
      .catch((error) => {
        console.log(error); // Logging an error, if any
      });
  };

  return (
    <div>
      <h2>Contact List</h2>
      <ul>
        {contacts.map((contact) => ( // Rendering the list of contacts
          <li key={contact.id}>
            <strong>Name:</strong> {contact.name}
            <br />
            <strong>Email:</strong> {contact.email}
            <br />
            <button onClick={() => handleEdit(contact.id, contact.name, contact.email)}>Edit</button> 
            <button onClick={() => handleDelete(contact.id)}>Delete</button> 
          </li>
        ))}
      </ul>

      <h2>Add Contact</h2>
      <form onSubmit={handleSubmit}> 
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} /> 
        </label>
        <br />
        <label>
          Email:
          <input type="text" value={email} onChange={handleEmailChange} /> 
        </label>
        <br />
        <button type="submit">Add Contact</button> 
      </form>

      {editId && ( // Conditionally rendering the edit form if there is an edit ID
        <div>
          <h2>Edit Contact</h2>
          <form onSubmit={handleEditSubmit}> 
            <label>
              Name:
              <input type="text" value={editName} onChange={handleEditNameChange} /> 
            </label>
            <br />
            <label>
              Email:
              <input type="text" value={editEmail} onChange={handleEditEmailChange} /> 
            </label>
            <br />
            <button type="submit">Update Contact</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ContactList; // Exporting the ContactList component
