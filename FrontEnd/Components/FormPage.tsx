import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View, Button, StyleSheet, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Toast, { SuccessToast, ErrorToast } from 'react-native-toast-message';
import { BaseToastProps } from 'react-native-toast-message';
import { BACKEND_URL } from '@env';

// Define the type for the user details
interface UserDetails {
    name: string;
    email: string;
    contacts: string;
    gender: string;
    address: string;
}



// Customize toast config to ensure top-right positioning
const toastConfig = {
    success: (props: BaseToastProps) => (
        <SuccessToast
            {...props}
            style={{ borderLeftColor: 'green' }}
            text1Style={{ fontSize: 16, fontWeight: 'bold', color: 'green' }}
            text2Style={{ fontSize: 14, color: 'black' }}
        />
    ),
    error: (props: BaseToastProps) => (
        <ErrorToast
            {...props}
            style={{ borderLeftColor: 'red' }}
            text1Style={{ fontSize: 16, fontWeight: 'bold', color: 'red' }}
            text2Style={{ fontSize: 14, color: 'black' }}
        />
    ),
};


{/*  // There are some issue in this code 
    import React from 'react';
import { BaseToastProps } from 'react-native-toast-message';
import * as Animatable from 'react-native-animatable';
import { SuccessToast, ErrorToast } from 'react-native-toast-message';

const toastConfig = {
    success: (props: BaseToastProps) => (
        <Animatable.View
            animation="fadeInRight" // Toast will fade in from the right
            duration={500} // Duration for fade-in
            style={{
                position: 'absolute',
                top: 40,  // Adjust based on where you want it
                right: 10,  // Right position to align with the top-right corner
                marginBottom: 10,  // Bottom space from the top-right corner
                borderLeftColor: 'green',
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
            }}
        >
            <SuccessToast
                {...props}
                style={[
                    props.style, // Merging the existing style
                    {
                        backgroundColor: 'white', // Optional, change to your background color
                    }
                ]}
                text1Style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'green',
                }}
                text2Style={{
                    fontSize: 14,
                    color: 'black',
                }}
            />
        </Animatable.View>
    ),
    error: (props: BaseToastProps) => (
        <Animatable.View
            animation="fadeInRight" // Toast will fade in from the right
            duration={500} // Duration for fade-in
            style={{
                position: 'absolute',
                top: 40, // Adjust based on where you want it
                right: 10, // Right position to align with the top-right corner
                marginBottom: 10, // Bottom space from the top-right corner
                borderLeftColor: 'red',
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
            }}
        >
            <ErrorToast
                {...props}
                style={[
                    props.style, // Merging the existing style
                    {
                        backgroundColor: 'white', // Optional, change to your background color
                    }
                ]}
                text1Style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'red',
                }}
                text2Style={{
                    fontSize: 14,
                    color: 'black',
                }}
            />
        </Animatable.View>
    ),
};

export default toastConfig;

    */}



function UserDetailsForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contacts, setContacts] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        contacts: false,
        gender: false,
        address: false
    });
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const validateFields = () => {
        const newErrors = {
            name: !name.trim(),
            email: !email.trim(),
            contacts: !contacts.trim(),
            gender: !gender.trim(),
            address: !address.trim(),
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    { /*
        const handleSubmit = () => {
            if (validateFields()) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Form submitted successfully!',
                });
                Alert.alert('Success', 'Form submitted successfully!');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Please fill in all required fields.',
                });
                Alert.alert('Error', 'Please fill in all required fields.');
            }
        };
        */
    }

    const addUserDetails = async () => {
        if (validateFields()) {
            setIsLoading(true);

            const user: UserDetails = {
                name,
                email,
                contacts,
                gender,
                address,
            };

            try {
                const response = await fetch(`${BACKEND_URL}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user),
                });

                if (response.ok) {
                    setName('');
                    setEmail('');
                    setContacts('');
                    setGender('');
                    setAddress('');
                    setErrors({ name: false, email: false, contacts: false, gender: false, address: false }); // Reset errors
                    setStatusMessage('User details added successfully!');
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: 'User details added successfully!',
                    });
                }

                else {
                    throw new Error('Failed to add user details');
                }
            } catch (error) {
                setIsLoading(false);
                setStatusMessage('Failed to add user details. Please try again.');
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to add user details. Please try again.',
                });
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headingText}>Vendor Registration</Text>
            <Text style={styles.label}>
                Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
                style={[styles.textInput, errors.name && styles.errorBorder]}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.label}>
                Email <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
                style={[styles.textInput, errors.email && styles.errorBorder]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.label}>
                Contacts <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
                style={[styles.textInput, errors.contacts && styles.errorBorder]}
                placeholder="Contacts"
                value={contacts}
                onChangeText={setContacts}
            />
            <Text style={styles.label}>
                Gender <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.genderContainer, errors.gender && styles.errorBorder]}>
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
            <Text style={styles.label}>
                Address <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
                style={[styles.textInput, errors.address && styles.errorBorder]}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                multiline
            />
            <View style={styles.buttonContainer}>
                <Button
                    title={isLoading ? 'Adding...' : 'Add User Details'}
                    onPress={addUserDetails}
                    disabled={isLoading}
                />
            </View>
            {/* Status message below the form */}
            {statusMessage && (
                <Text style={styles.statusMessage}>{statusMessage}</Text>
            )}

            <Toast config={toastConfig} />
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    headingText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    required: {
        color: 'red',
    },
    textInput: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        color: '#333',
    },
    errorBorder: {
        borderColor: 'red',
    },
    genderContainer: {
        marginBottom: 20,
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
        marginLeft: 8,
        color: '#333',
    },
    buttonContainer: {
        marginTop: 20,
    },

    statusMessage: {
        marginTop: 20,
        fontSize: 16,
        color: 'green',  // You can change the color based on the message type
        fontWeight: 'bold',
    },
});


export default UserDetailsForm;
