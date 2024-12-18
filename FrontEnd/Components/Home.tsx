import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Home = ({ navigation }: { navigation: any }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to the Home Screen!</Text>
            <Button
                title="Go to Saved Data"
                onPress={() => navigation.navigate('SavedData')}
            />
            <Button
                title="Go to Form Page"
                onPress={() => navigation.navigate('FormPage')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default Home;
