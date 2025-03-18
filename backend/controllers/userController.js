const fetch = require("node-fetch");

// Fetch all users using R
const getUsers = async (req, res) => {
  try {
    // Fetch Realtime data from Firebase
    const response = await fetch(
      "https://loginform-90dc7-default-rtdb.firebaseio.com/users.json"
    );

    // Check if the fetch was successful
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch data. Status: ${response.status}` });
    }

    // Parse the JSON data
    const data = await response.json();

    // Check if there are users in the response
    if (data) {
      const userList = Object.keys(data).map((key) => ({
        uid: key,
        ...data[key],
      }));

      return res.status(200).json(userList);
    } else {
      return res.status(200).json([]); // Return empty array if no users found
    }
  } catch (error) {
    // Handle error when fetch fails or there's a parsing issue
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Add a new user using Firebase REST API
const addUser = async (req, res) => {
  try {
    // Log the incoming request body
    console.log("Incoming user data:", req.body);

    const response = await fetch(
      "https://loginform-90dc7-default-rtdb.firebaseio.com/users.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    // Check if the fetch was successful
    if (!response.ok) {
      const errorData = await response.json(); // Log the error response from Firebase
      console.error("Error response from Firebase:", errorData);
      return res
        .status(response.status)
        .json({ error: `Failed to add user. Status: ${response.status}` });
    }

    // Parse the response data
    const data = await response.json();
    console.log("Firebase response:", data);

    // Check if 'name' is present in the Firebase response
    if (data && data.name) {
      return res
        .status(201)
        .json({ message: "User added successfully", id: data.name });
    } else {
      // If 'name' is missing, return an error
      return res.status(500).json({ error: "Failed to add user: Missing ID" });
    }
  } catch (error) {
    // Handle any other unexpected errors
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Failed to add user" });
  }
};

// Update a user using Firebase REST API
const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const response = await fetch(
      `https://loginform-90dc7-default-rtdb.firebaseio.com/users/${uid}.json`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    // Check if the fetch was successful
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to update user. Status: ${response.status}` });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete a user using Firebase REST API
const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const response = await fetch(
      `https://loginform-90dc7-default-rtdb.firebaseio.com/users/${uid}.json`,
      {
        method: "DELETE",
      }
    );

    // Check if the fetch was successful
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to delete user. Status: ${response.status}` });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
};
