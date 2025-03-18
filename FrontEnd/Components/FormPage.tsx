import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View, Button, StyleSheet, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-toast-message';
import { BACKEND_URL } from '@env';
import useLocation from './LocationServices'; // Import your location service
import Icon from 'react-native-vector-icons/MaterialIcons';

interface UserDetails {
    name: string;
    email: string;
    contacts: string;
    gender: string;
    address: string;
    latitude: number;
    longitude: number;
}

const UserDetailsForm = () => {
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
        address: false,
    });
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const { location, error } = useLocation(); // Use the custom location hook

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

 const addUserDetails = async () => {
        if (validateFields()) {
            setIsLoading(true);

            if (!location.latitude || !location.longitude) {
                Alert.alert('Location Error', 'Unable to fetch location.');
                setIsLoading(false);
                return;
            }

            const user: UserDetails = {
                name,
                email,
                contacts,
                gender,
                address,
                latitude: location.latitude,
                longitude: location.longitude,
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
                    setErrors({ name: false, email: false, contacts: false, gender: false, address: false });  // Reset errors
                    setStatusMessage('User details added successfully!');
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: 'User details added successfully!',
                    });
                } else {
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
            setIsLoading(false);
        }
    };




    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headingText}>Vendor Registration</Text>
            <Text style={styles.label}>Name <Text style={styles.required}>*</Text></Text>
            <TextInput
                style={[styles.textInput, errors.name && styles.errorBorder]}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
            <TextInput
                style={[styles.textInput, errors.email && styles.errorBorder]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.label}>Contacts <Text style={styles.required}>*</Text></Text>
            <TextInput
                style={[styles.textInput, errors.contacts && styles.errorBorder]}
                placeholder="Contacts"
                value={contacts}
                onChangeText={setContacts}
            />
            <Text style={styles.label}>Gender <Text style={styles.required}>*</Text></Text>
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
            <Text style={styles.label}>Address <Text style={styles.required}>*</Text></Text>
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
            
            {/* Show Location */}
            {
                location.address && (
            <View style={styles.locationContainer}>
                {/* Location Icon */}
                <View style={styles.iconContainer}>
                    <Icon name="location-on" size={30} color="#ff5722" />
                </View>

                {/* Address Text */}
                <View style={styles.addressContainer}>
                    <Text style={styles.labelText}>Your Location:</Text>
                    <Text style={styles.addressText}>{location.address}</Text>
                </View>
            </View>
        )
            }

            {statusMessage && (
                <Text style={styles.statusMessage}>{statusMessage}</Text>
            )}
            <Toast />
        </ScrollView>
    );
};

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
        color: 'green',
        fontWeight: 'bold',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        margin: 10,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    addressContainer: {
        flex: 1,
    },
    labelText: {
        fontSize: 14,
        color: '#888',
        fontWeight: '600',
        marginBottom: 2,
    },
    addressText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
});

export default UserDetailsForm;
