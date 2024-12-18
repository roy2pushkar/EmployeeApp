import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginApp from './Components/FormPage'; // Your existing Login screen component
import SavedData from './Components/SavedData'; // Your new SavedData screen component

// Define route params
type RootStackParamList = {
  Home: undefined;
  LoginScreen: undefined;
  SavedData: undefined; // Add SavedData screen to the stack
};

// Create the stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// HomeScreen component
const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Welcome to the Home Page</Text>
      <Button
        title="Go to Login Screen"
        onPress={() => navigation.navigate('LoginScreen')} // Navigate to LoginPage screen
      />
      <Button
        title="Go to Saved Data"
        onPress={() => navigation.navigate('SavedData')} // Navigate to SavedData screen
      />
    </View>
  );
};

// App component with Navigation
export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          {/* Here Home Screen */}
          <Stack.Screen name="Home" component={HomeScreen} />
          {/* Here Login Screen */}
          <Stack.Screen name="LoginScreen" component={LoginApp} />
          {/* here SavedData Screen */}
          <Stack.Screen name="SavedData" component={SavedData} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

// Styling
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#708090',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#708090',
    marginBottom: 20,
    textAlign: 'center',
  },
});
