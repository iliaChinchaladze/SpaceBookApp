import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from './screens/loginPage';
import Signup from './screens/signupPage';
import Home from './screens/Home';
import CameraP from './screens/cameraPage';
import Post from './screens/PostPage';
import CameraIcon from './assets/cameraIcon.png';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreenNav(){
  return(
      <Tab.Navigator screenOptions={{ headerShown: false }} >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="cameraPage" component={CameraP} />
        <Tab.Screen name="Post" component={Post} />
      </Tab.Navigator>
  )
}

class todo extends Component{
  render() {
    return (
      <View style={styles.container}>
      <NavigationContainer >
        <Stack.Navigator initialRouteName="loginPage"  >
          <Stack.Screen name="Login" component={Login}  />
          <Stack.Screen name="signupPage" component={Signup}  />
          <Stack.Screen name="Home" component={HomeScreenNav}/>
        </Stack.Navigator>    
      </NavigationContainer>
      </View>
    );
  }

  


}
const styles = StyleSheet.create({
  container:{
    flex:1,
    margin:0
  },
  asnwerBox:{
    justifyContent: "center",
    alignItems:"center"
  },
  input:{
    height: 40,
    margin: 20,
    borderWidth: 1,
    padding: 10,
  }
  
});


export default todo;