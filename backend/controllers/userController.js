// Use node-fetch for server-side fetching
const fetch = require('node-fetch');


// Fetch all users using R
const getUsers = async (req, res) => {
  try {
    console.log('Fetching all users'); // Log when the function is called
    
    // GET request 
    const response = await fetch('https://loginform-90dc7-default-rtdb.firebaseio.com/users.json');
    const data = await response.json(); // Parse the response as JSON

    
    console.log('Fetched data:', JSON.stringify(data, null, 2));
    console.log('API called!');


    if (data) {
      
      const userList = Object.keys(data).map((key) => ({
        uid: key,
        ...data[key],
      }));

      console.log('Formatted user list:', userList); 
      res.status(200).json(userList); 
    } else {
      console.log('No users found');
      res.status(200).json([]); 
    }
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Add a new user using Firebase REST API
const addUser = async (req, res) => {
  try {
    console.log('Adding new user:', req.body);
    
    // Making a POST request 
    const response = await fetch('https://loginform-90dc7-default-rtdb.firebaseio.com/users.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Sending JSON data
      },
      body: JSON.stringify(req.body), // Convert the body to JSON string
    });

    const data = await response.json(); // Parse the response as JSON

    console.log('User added with ID:', data.name); // Firebase returns the ID in the "name" property
    res.status(201).json({ message: 'User added successfully', id: data.name });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
};

// Update a user using Firebase REST API
const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    console.log('Updating user with UID:', uid); // Log the UID of the user being updated
    console.log('Request body for update:', req.body); // Log the request body for update

    // Making a PATCH request to Firebase to update the user
    const response = await fetch(`https://loginform-90dc7-default-rtdb.firebaseio.com/users/${uid}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json', // Sending JSON data
      },
      body: JSON.stringify(req.body), // Convert the body to JSON string
    });

    if (response.ok) {
      console.log('User updated successfully');
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      console.error('Failed to update user');
      res.status(500).json({ error: 'Failed to update user' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete a user using Firebase REST API
const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;
    console.log('Deleting user with UID:', uid); // Log the UID of the user being deleted

    // Making a DELETE request to Firebase to delete the user
    const response = await fetch(`https://loginform-90dc7-default-rtdb.firebaseio.com/users/${uid}.json`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('User deleted successfully');
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      console.error('Failed to delete user');
      res.status(500).json({ error: 'Failed to delete user' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
};
