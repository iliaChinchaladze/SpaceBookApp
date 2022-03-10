/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SpaceBack from './logo/spacePic.JPG';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      postData: [],
      userDetails: [],
      photo: null,
      postLink: 'http://localhost:3333/api/1.0.0',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.pageReload = this.props.navigation.addListener('focus', () => {
      this.getPost();
      this.get_profile_image();
      this.getUserDetails();
    });

    this.getPost();
    this.getUserDetails();
    this.get_profile_image();
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.pageReload();
  }

  unlikePost = async (postID) => {
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@session_id');

    return fetch(`${this.state.postLink}/user/${id}/post/${postID}/like`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorized');
        } else if (response.status === 403) {
          throw new Error('You have not liked this post');
        } else if (response.status === 404) {
          throw new Error('not Found');
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

  delPost = async (postID) => {
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@session_id');

    return fetch(`${this.state.postLink}/user/${id}/post/${postID}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getPost();
          this.setState({
            isLoading: false,
          });
        } else if (response.status === 401) {
          throw new Error('Unauthorized');
        } else if (response.status === 403) {
          throw new Error('Forbidden');
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

  likePost = async (postID) => {
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@session_id');

    return fetch(`${this.state.postLink}/user/${id}/post/${postID}/like`, {
      method: 'POST',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getPost();
        } else if (response.status === 401) {
          throw new Error('Unauthorized');
        } else if (response.status === 403) {
          throw new Error('You have already liked this post');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getUserDetails = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(`${this.state.postLink}/user/${id}`, {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorized');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((responseJson) => {
        this.setState({
          userDetails: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getPost = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(`${this.state.postLink}/user/${id}/post`, {
      method: 'GET',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorized');
        } else if (response.status === 403) {
          throw new Error('Can only view the posts of yourself or your friends');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          postData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >

          <Text>Loading..</Text>
        </View>
      );
    }
    return (
      <View style={{ backgroundColor: '#d0d0f7', flex: 1 }}>
        <ImageBackground source={SpaceBack} resizeMode="cover" style={styles.image}>
          <View style={styles.profileContainer}>

            <Image
              source={{ uri: this.state.photo }}
              style={{
                width: 100, height: '95%', borderWidth: 5, borderRadius: 200,
              }}
            />
            <Text style={{ fontFamily: 'italic', fontSize: 18, alignSelf: 'center' }}>
              {' '}
              {this.state.userDetails.first_name}
              {this.state.userDetails.last_name}
              {' '}

            </Text>

          </View>

          <FlatList
            data={this.state.postData}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity onPress={async () => {
                  await AsyncStorage.setItem('@postId', item.post_id);
                  await AsyncStorage.setItem('@posterID', item.author.user_id);
                  this.props.navigation.navigate('SinglePost');
                }}
                >
                  <View style={styles.postContainer}>
                    <Text style={{ fontFamily: 'italic', fontSize: 18 }}>
                      {' '}
                      {item.author.first_name}
                      {' '}
                      :
                      {' '}
                      {item.text}
                      {' '}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={{
                  alignSelf: 'center', marginBottom: 10, flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.5)', padding: 5, borderRadius: 5,
                }}
                >
                  <TouchableOpacity
                    onPress={() => this.likePost(item.post_id)}
                    style={{ marginHorizontal: 5 }}
                  >
                    <Text style={{ fontSize: 20 }}>
                      {' '}
                      {item.numLikes}
                      👍
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.unlikePost(item.post_id)}
                    style={{ marginHorizontal: 5 }}
                  >
                    <Text style={{ fontSize: 20 }}>👎</Text>

                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.delPost(item.post_id)}
                    style={{ marginHorizontal: 5 }}
                  >
                    <Text style={{ fontSize: 20 }}>❌</Text>

                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.post_id.toString()}
          />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 16,
    alignSelf: 'center',
  },
  button: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: '#61DBFB',
  },
  postContainer: {
    flex: 1,
    padding: 20,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(25,118,211,0.8)',
    shadowColor: 'black',
    shadowRadius: 10,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  profileContainer: {
    height: 110,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 2,
    marginTop: 10,
    flexDirection: 'row',
    borderRadius: 20,
    shadowRadius: 10,
    marginBottom: 10,
  },
});

export default Home;
