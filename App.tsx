import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './src/firebasedemo/LoginScreen'
import RegisterScreen from './src/firebasedemo/RegisterScreen'
import HomeScreen from './src/firebasedemo/HomeScreen'
import Profile from './src/firebasedemo/Profile'
import AddHobbies from './src/firebasedemo/AddHobbies'
import OtherPeople from './src/firebasedemo/OtherPeople'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name='LoginScreen' component={LoginScreen} />
        <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
        <Stack.Screen name='HomeScreen' component={HomeScreen} />
        <Stack.Screen name='OtherPeople' component={OtherPeople} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='AddHobbies' component={AddHobbies} />

      </Stack.Navigator>

    </NavigationContainer>
  )
}