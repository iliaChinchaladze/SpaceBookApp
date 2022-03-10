/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Button, TextInput, ScrollView, StyleSheet, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      postLink: 'http://localhost:3333/api/1.0.0',
    };
  }

  update = async () => {
    // Validation here...
    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');

    const toSend = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
    };
    if (this.state.first_name === '') {
      throw new Error('Name can not be an empty space');
    } else if (this.state.last_name === '') {
      throw new Error('Surname can not be an empty space');
    } else {
      return fetch(`${this.state.postLink}/user/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify(toSend),
      })
        .then((response) => {
          if (response.status === 200) {
            console.log('User updated with ID: ', response);
            this.props.navigation.navigate('Profile');
          } else if (response.status === 400) {
            throw new Error('Failed validation');
          } else if (response.status === 401) {
            throw new Error('Unauthorized');
          } else if (response.status === 403) {
            throw new Error('Forbidden');
          } else if (response.status === 404) {
            throw new Error('Not Found');
          } else {
            console.log(response.status);
            throw new Error('Something went wrong');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>

        <ScrollView>
          <Image
            style={{ width: 150, height: 190, alignSelf: 'center' }}
            source={require('./logo/spacebook-logos_transparent.png')}
          />
          <TextInput
            style={styles.input}
            placeholder="Update your first name..."
            onChangeText={(first_name) => this.setState({ first_name })}
            value={this.state.first_name}
          />
          <TextInput
            style={styles.input}
            placeholder="Update your last name..."
            onChangeText={(last_name) => this.setState({ last_name })}
            value={this.state.last_name}
          />
          <Button
            title="Update an account"
            onPress={() => this.update()}
          />
          <Button
            title="Back"
            onPress={() => this.props.navigation.navigate('Home')}
          />
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 300,
    height: 40,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 16,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  button: {
    margin: 10,
    marginVertical: 20,

  },
});
export default UpdateProfile;
