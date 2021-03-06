import React, { Component } from 'react';
import {
  StyleSheet, Text, TextInput, Alert, SafeAreaView, ImageBackground, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { View } from 'react-native-web';
import SpaceBackgr from './logo/spacePic.JPG';

class PostPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: '',
      postLink: 'http://localhost:3333/api/1.0.0',
    };
  }

  addPost = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');

    const toSend = {
      text: this.state.post,
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
          Alert.alert('Post added');
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

  Draft = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('@draftPost'));
    if (data == null) {
      const draftPost = [{ text: this.state.post, id: 0 }];
      await AsyncStorage.setItem('@draftPost', JSON.stringify(draftPost));
    } else {
      const index = data.length;
      const draftPost2 = { text: this.state.post, id: index };
      data.push(draftPost2);
      await AsyncStorage.setItem('@draftPost', JSON.stringify(data));
    }
  };

  render() {
    return (
      <ImageBackground source={SpaceBackgr} resizeMode="cover" style={styles.image}>
        <SafeAreaView style={styles.SafeAreaViewStyle}>

          <TextInput
            style={styles.input}
            multiline="true"
            placeholder="What's on your mind?"
            onChangeText={(text) => { this.setState({ post: text }); }}
          />
          <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
            <TouchableOpacity
              onPress={() => { this.addPost(); }}
              style={styles.button}
            >
              <Text>Post</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { this.Draft(); }}
              style={styles.button}
            >
              <Text>Save Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { this.props.navigation.navigate('Drafts'); }}
              style={styles.button}
            >
              <Text>Show drafts</Text>
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
export default PostPage;
