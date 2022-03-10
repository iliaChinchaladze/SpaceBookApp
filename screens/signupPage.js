/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Button, TextInput, ScrollView, StyleSheet, Image,
} from 'react-native';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password1: '',
      postLink: 'http://localhost:3333/api/1.0.0',
    };
  }

  signup() {
  // Validation here...
    const toSend = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password,
    };
    if (this.state.password !== this.state.password1) {
      throw new Error('Passwords are not the same');
    } else if (this.state.first_name === '') {
      throw new Error('Name can not be an empty space');
    } else if (this.state.last_name === '') {
      throw new Error('Surname can not be an empty space');
    } else if (this.state.email.includes('@') === false) {
      throw new Error('Invalid Mail');
    } else if (this.state.password.length < 6) {
      throw new Error('Password needs to be greater then 6 characters');
    } else {
      return fetch(`${this.state.postLink}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toSend),
      })
        .then((response) => {
          if (response.status === 201) {
            return response.json();
          } if (response.status === 400) {
            throw new Error('Failed validation');
          } else if (response.status === 500) {
            throw new Error('Server Error');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then((responseJson) => {
          console.log('User created with ID: ', responseJson);
          this.props.navigation.navigate('Login');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

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
            placeholder="Enter your first name..."
            onChangeText={(first_name) => this.setState({ first_name })}
            value={this.state.first_name}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your last name..."
            onChangeText={(last_name) => this.setState({ last_name })}
            value={this.state.last_name}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your email..."
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password..."
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Repeat your password..."
            onChangeText={(password1) => this.setState({ password1 })}
            value={this.state.password1}
            secureTextEntry
          />
          <View style={{ justifyContent: 'space-between', marginBottom: 20 }}>
            <Button
              title="Create an account"
              onPress={() => this.signup()}
            />
            <Button
              title="Back"
              onPress={() => this.props.navigation.navigate('Login')}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    margin: 30,
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

export default Signup;
