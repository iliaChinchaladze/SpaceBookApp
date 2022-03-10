/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  StyleSheet, Text, TextInput, Alert, SafeAreaView, ImageBackground, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SpaceBackgr from './logo/spacePic.JPG';

class UsersPostPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: '',
      postLink: 'http://localhost:3333/api/1.0.0',
    };
  }

  addPost = async () => {
    const id = await AsyncStorage.getItem('@userID');
    const token = await AsyncStorage.getItem('@session_token');

    const to_send = {
      text: this.state.post,
    };
    return fetch(`${this.state.postLink}/user/${id}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(to_send),
    })
      .then((response) => {
        if (response.status === 201) {
          Alert.alert('Post added');
          this.props.navigation.navigate('UserProfile');
        } else if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <ImageBackground source={SpaceBackgr} resizeMode="cover" style={styles.image}>
        <SafeAreaView style={styles.SafeAreaViewStyle}>

          <TextInput
            style={styles.input}
            multiline="true"
            placeholder="Post on your friends page"
            onChangeText={(text) => { this.setState({ post: text }); }}
          />
          <TouchableOpacity
            onPress={() => { this.addPost(); }}
            style={styles.button}
          >
            <Text>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={styles.button}
          >
            <Text>Go back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 90,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
    shadowRadius: 20,
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#61DBFB',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  SafeAreaViewStyle: {
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
});
export default UsersPostPage;
