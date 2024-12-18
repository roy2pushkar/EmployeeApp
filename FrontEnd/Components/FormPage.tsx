import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View, Button, StyleSheet, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { BACKEND_URL } from '@env';

// Define the type for the user details
interface UserDetails {
    name: string;
    email: string;
    contacts: string;
    gender: string;
    address: string;
}

function UserDetailsForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contacts, setContacts] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null); // For displaying success/error message

    // Function to make API call to add user details
    const addUserDetails = async () => {
        if (name.trim() && email.trim() && contacts.trim() && gender.trim()) {
            setIsLoading(true);

            const user = {
                name: name,
                email: email,
                contacts: contacts,
                gender: gender,
                address: address,
                createdAt: new Date().toISOString(),
            };

            try {
                const response = await fetch(
                    `${BACKEND_URL}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(user),
                    }
                );

                if (response.ok) {
                    // Reset form fields after successful submission
                    setName('');
                    setEmail('');
                    setContacts('');
                    setGender('');
                    setAddress('');
                    setIsLoading(false);
                    setMessage('User details added successfully!'); // Success message
                } else {
                    throw new Error('Failed to add user details');
                }
            } catch (error) {
                setIsLoading(false);
                console.error('Error adding user details: ', error);
                setMessage('Failed to add user details. Please try again.'); // Error message
            }
        } else {
            setMessage('Please fill in all fields.'); // Validation error message
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headingText}>User Details Form</Text>
            {/* Form Details Section */}
            <TextInput
                style={styles.textInput}
                placeholder="Name"
                placeholderTextColor="#888" // Light gray placeholder for visibility
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Contacts"
                placeholderTextColor="#888"
                value={contacts}
                onChangeText={setContacts}
            />

            {/* Gender selection with checkboxes */}
            <View style={styles.genderContainer}>
                <Text style={styles.genderLabel}>Gender</Text>
                <View style={styles.checkboxContainer}>
                    <View style={styles.checkboxItem}>
                        <CheckBox
                            value={gender === 'male'}
                            onValueChange={() => setGender('male')}
                        />
                        <Text style={styles.checkboxText}>Male</Text>
                    </View>
                    <View style={styles.checkboxItem}>
                        <CheckBox
                            value={gender === 'female'}
                            onValueChange={() => setGender('female')}
                        />
                        <Text style={styles.checkboxText}>Female</Text>
                    </View>
                    <View style={styles.checkboxItem}>
                        <CheckBox
                            value={gender === 'others'}
                            onValueChange={() => setGender('others')}
                        />
                        <Text style={styles.checkboxText}>Others</Text>
                    </View>
                </View>
            </View>

            {/* Button to add user details */}
            <View style={styles.buttonContainer}>
                <Button
                    title={isLoading ? 'Adding...' : 'Add User Details'}
                    onPress={addUserDetails}
                    disabled={isLoading}
                />
            </View>

            {/* Display success or error message */}
            {message && (
                <Text style={styles.messageText}>{message}</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ensure it fills available space
        padding: 16,
        backgroundColor: '#f4f4f4', // Ensure background is visible
    },
    headingText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#6200ee',
        textAlign: 'center',
    },
    textInput: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        borderRadius: 8,
        paddingHorizontal: 10,
        color: '#000', // Black text for contrast
        backgroundColor: '#fff', // White background for inputs
    },
    genderContainer: {
        marginBottom: 20,
    },
    genderLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#6200ee',
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxText: {
        fontSize: 16,
        color: '#000', // Black text for visibility
        marginLeft: 8,
    },
    buttonContainer: {
        marginTop: 16,
        marginBottom: 20,
    },
    messageText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d32f2f',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default UserDetailsForm;
