import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TextInput, Button, Modal } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-toast-message';
import { BACKEND_URL } from '@env';

// Define the type for user details
interface UserDetails {
    uid: string;
    name: string;
    email: string;
    contacts: string;
    gender: string;
    address: string;
}

// Firebase Realtime Database REST URL
//const BACKEND_URL = 'https://loginform-90dc7-default-rtdb.firebaseio.com/users';

const SavedData = () => {
    const [userDetails, setUserDetails] = useState<UserDetails[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
    const [updatedUser, setUpdatedUser] = useState<UserDetails | null>(null);
    const [gender, setGender] = useState('');

    // Function to fetch user details using REST API
    const fetchUserDetails = async () => {
        setIsLoading(true); // Show loader while fetching
        try {
            // Adjusted URL to match the actual backend route without '.json'
            const response = await fetch(`${BACKEND_URL}`);

            if (!response.ok) {
                throw new Error('Failed to fetch data from backend');
            }

            const data = await response.json(); // Parse the JSON response
            if (data) {
                const userList = Object.keys(data).map((key) => ({
                    uid: key,
                    ...data[key],
                }));
                setUserDetails(userList); // Store the fetched user data in state
            } else {
                setUserDetails([]); // Handle case where no data exists
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            Alert.alert('Error', 'Unable to fetch data. Please try again later.');
        } finally {
            setIsLoading(false); // Hide loader
        }
    };

    // Function to delete a user
    const deleteUser = async (uid: string) => {
        try {
            await fetch(`${BACKEND_URL}/${uid}`, { method: 'DELETE' });
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'User deleted successfully!',
            });
            fetchUserDetails();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete user. Please try again.',
            });
        }
    };
    // Function to Update a user
    const updateUser = async () => {
        if (!updatedUser || !updatedUser.uid) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Invalid user data.',
            });
            return;
        }
        try {
            await fetch(`${BACKEND_URL}/${updatedUser.uid}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: updatedUser.name,
                    email: updatedUser.email,
                    contacts: updatedUser.contacts,
                    gender: updatedUser.gender,
                    address: updatedUser.address,
                }),
            });
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'User updated successfully!',
            });
            setIsModalVisible(false);
            fetchUserDetails();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to update user. Please try again.',
            });
        }
    };


    // Open update modal with selected user details
    const openUpdateModal = (user: UserDetails) => {
        setSelectedUser(user);
        setUpdatedUser(user);
        setGender(user.gender);
        setIsModalVisible(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedUser(null);
        setUpdatedUser(null);
    };

    // Handle input change for update
    const handleInputChange = (key: keyof UserDetails, value: string) => {
        setUpdatedUser((prev) => (prev ? { ...prev, [key]: value } : null));
    };

    // Call fetchUserDetails on component mount
    useEffect(() => {
        fetchUserDetails();
    }, []);

    // Render item for FlatList
    const renderItem = ({ item }: { item: UserDetails }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.email}</Text>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.cardText}>UID: {item.uid}</Text>
                <Text style={styles.cardText}>Contacts: {item.contacts}</Text>
                <Text style={styles.cardText}>Gender: {item.gender}</Text>
                <Text style={styles.cardText}>Address: {item.address}</Text>
            </View>
            <View style={styles.cardActions}>
                <Button title="Update" color="#6200ee" onPress={() => openUpdateModal(item)} />
                <Button title="Delete" color="#d32f2f" onPress={() => deleteUser(item.uid)} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#6200ee" />
            ) : userDetails.length > 0 ? (
                <FlatList
                    data={userDetails}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.uid}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <Text style={styles.noDataText}>No data available.</Text>
            )}

            {/* Update Modal */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update User</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Name"
                            value={updatedUser?.name}
                            onChangeText={(value) => handleInputChange('name', value)}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Email"
                            value={updatedUser?.email}
                            onChangeText={(value) => handleInputChange('email', value)}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Contacts"
                            value={updatedUser?.contacts}
                            onChangeText={(value) => handleInputChange('contacts', value)}
                        />
                        <View style={styles.genderContainer}>
                            <Text style={styles.genderLabel}>Gender</Text>
                            <View style={styles.checkboxContainer}>
                                <View style={styles.checkboxItem}>
                                    <CheckBox
                                        value={gender === 'male'}
                                        onValueChange={() => setGender('male')}
                                        tintColors={{ true: '#6200ee', false: '#ccc' }} // Adds color when checked/unchecked
                                    />
                                    <Text style={styles.checkboxText}>Male</Text>
                                </View>
                                <View style={styles.checkboxItem}>
                                    <CheckBox
                                        value={gender === 'female'}
                                        onValueChange={() => setGender('female')}
                                        tintColors={{ true: '#6200ee', false: '#ccc' }} // Adds color when checked/unchecked
                                    />
                                    <Text style={styles.checkboxText}>Female</Text>
                                </View>
                                <View style={styles.checkboxItem}>
                                    <CheckBox
                                        value={gender === 'others'}
                                        onValueChange={() => setGender('others')}
                                        tintColors={{ true: '#6200ee', false: '#ccc' }} // Adds color when checked/unchecked
                                    />
                                    <Text style={styles.checkboxText}>Others</Text>
                                </View>
                            </View>
                        </View>


                        <TextInput
                            style={styles.textInput}
                            placeholder="Address"
                            value={updatedUser?.address}
                            onChangeText={(value) => handleInputChange('address', value)}
                        />
                        <View style={styles.modalActions}>
                            <Button title="Save" onPress={updateUser} />
                            <Button title="Cancel" color="#d32f2f" onPress={closeModal} />
                        </View>
                    </View>
                </View>
            </Modal>
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    listContent: {
        paddingBottom: 16,
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardHeader: {
        backgroundColor: '#6200ee',
        padding: 16,
    },
    cardTitle: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#e0e0e0',
        marginTop: 4,
    },
    cardBody: {
        padding: 16,
    },
    cardText: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 8,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    noDataText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
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
    placeholderStyle: {
        color: '#aaa',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 10,
    },
    genderContainer: {
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    genderLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
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
});



export default SavedData;
