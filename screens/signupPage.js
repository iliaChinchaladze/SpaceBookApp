import React, { Component } from 'react';
import { Text, View, Button, TextInput, ScrollView, StyleSheet, Image } from 'react-native';

class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    }

    signup = () => {
        //Validation here...

        return fetch("http://localhost:3333/api/1.0.0/user", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            })
            .then((response) => {
                if (response.status === 201) {
                    return response.json()
                } else if (response.status === 400) {
                    throw 'Failed validation';
                } else {
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
                console.log("User created with ID: ", responseJson);
                this.props.navigation.navigate("Login");
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        return ( <
            View style = { styles.container } >
            <
            ScrollView >
            <
            Image style = {
                { width: 150, height: 190, alignSelf: 'center' } }
            source = { require("./logo/spacebook-logos_transparent.png") }
            /> <
            TextInput style = { styles.input }
            placeholder = "Enter your first name..."
            onChangeText = {
                (first_name) => this.setState({ first_name }) }
            value = { this.state.first_name }
            /> <
            TextInput style = { styles.input }
            placeholder = "Enter your last name..."
            onChangeText = {
                (last_name) => this.setState({ last_name }) }
            value = { this.state.last_name }
            /> <
            TextInput style = { styles.input }
            placeholder = "Enter your email..."
            onChangeText = {
                (email) => this.setState({ email }) }
            value = { this.state.email }
            /> <
            TextInput style = { styles.input }
            placeholder = "Enter your password..."
            onChangeText = {
                (password) => this.setState({ password }) }
            value = { this.state.password }
            secureTextEntry /
            >
            <
            Button title = "Create an account"
            onPress = {
                () => this.props.navigation.navigate('loginPage') }
            /> <
            /ScrollView> <
            /View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        margin: 30,
    },
    input: {
        height: 40,
        margin: 10,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        margin: 10,
        marginVertical: 20,

    },
});

export default Signup;