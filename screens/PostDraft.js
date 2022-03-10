/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TextInput, SafeAreaView, ImageBackground, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SpaceBackgr from './logo/spacePic.JPG';

class PostDraft extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postData: [],
      draft: [],
      postLink: 'http://localhost:3333/api/1.0.0',
    };
  }

  componentDidMount() {
    this.getPost();
  }

  getPost = async () => {
    const currentDraft = JSON.parse(await AsyncStorage.getItem('@currentDraft'));
    this.setState({ draft: currentDraft });
  };

  addPost = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');

    const toSend = {
      text: this.state.postData,
    };
    return fetch(`${this.state.postLink}/user/${id}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 201) {
          this.props.navigation.navigate('Home');
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
            defaultValue={(this.state.draft.text)}
            onChangeText={(text) => { this.setState({ postData: text }); }}
          />
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => { this.addPost(); }}
              style={styles.button}
            >
              <Text>✅</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.button}
            >
              <Text>🏡</Text>
            </TouchableOpacity>
          </View>
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
export default PostDraft;
