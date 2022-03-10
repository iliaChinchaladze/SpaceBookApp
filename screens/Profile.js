/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet, Image, Text, View, TouchableOpacity, ImageBackground,
} from 'react-native';

import SpaceBackgr from './logo/spacePic.JPG';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: null,
      isLoading: true,
      postLink: 'http://localhost:3333/api/1.0.0',
      token: '',
    };
  }

  componentDidMount() {
    this.get_profile_image();
    this.checkLoggedIn();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value != null) {
      this.setState({ token: value });
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  logout = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    await AsyncStorage.clear();
    return fetch(`${this.state.postLink}/logout`, {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate('Login');
        } else if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  get_profile_image = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    fetch(`${this.state.postLink}/user/${id}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  render() {
    if (!this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ImageBackground source={SpaceBackgr} resizeMode="cover" style={styles.image}>
            <Image
              source={{ uri: this.state.photo }}
              style={{
                width: 150, height: 150, borderWidth: 5, borderRadius: 200, alignSelf: 'center',
              }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={() => { this.logout(); }}
                style={styles.button}
              >
                <Text>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { this.props.navigation.navigate('UpdateProfile'); }}
                style={styles.button}
              >
                <Text>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      );
    }
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

    justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: '#61DBFB',
  },
});
