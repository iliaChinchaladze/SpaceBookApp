/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from './screens/loginPage';
import Signup from './screens/signupPage';
import Home from './screens/Home';
import CameraPage from './screens/cameraPage';
import Post from './screens/PostPage';
import Profile from './screens/Profile';
import UpdateProfile from './screens/UpdateProfile';
import Friends from './screens/Friends';
import UserProfile from './screens/UserProfile';
import SinglePost from './screens/SinglePost';
import UsersPostPage from './screens/UsersPostPage';
import SinglePostOther from './screens/singlePostOther';
import Drafts from './screens/Drafts';
import PostDraft from './screens/PostDraft';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreenNav() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: {} }}>
      <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: () => (<Text style={{ fontSize: 25 }}>🏡</Text>) }} />
      <Tab.Screen name="Camera" component={CameraPage} options={{ tabBarIcon: () => (<Text style={{ fontSize: 25 }}>📸</Text>) }} />
      <Tab.Screen name="Post" component={Post} options={{ tabBarIcon: () => (<Text style={{ fontSize: 25 }}>📰</Text>) }} />
      <Tab.Screen name="Friends" component={Friends} options={{ tabBarIcon: () => (<Text style={{ fontSize: 25 }}>🤼</Text>) }} />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarIcon: () => (<Text style={{ fontSize: 25 }}>👨‍🏫</Text>) }} />
    </Tab.Navigator>
  );
}

class todo extends Component {
  render() {
    return (
      // eslint-disable-next-line no-use-before-define
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="loginPage" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="signupPage" component={Signup} />
            <Stack.Screen name="Main" component={HomeScreenNav} />
            <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="SinglePost" component={SinglePost} />
            <Stack.Screen name="UsersPostPage" component={UsersPostPage} />
            <Stack.Screen name="SinglePostOther" component={SinglePostOther} />
            <Stack.Screen name="Drafts" component={Drafts} />
            <Stack.Screen name="PostDraft" component={PostDraft} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
  },
  input: {
    height: 40,
    margin: 20,
    borderWidth: 1,
    padding: 10,
  },

});

export default todo;
