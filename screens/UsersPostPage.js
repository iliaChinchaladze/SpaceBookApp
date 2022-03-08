import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, SafeAreaView, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

import SpaceBackgr from './logo/spacePic.JPG';

class UsersPostPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            post: "",
            postLink: "http://localhost:3333/api/1.0.0"
        }
    }
    render() {
        return (
            <ImageBackground source={SpaceBackgr} resizeMode="cover" style={styles.image}>
                <SafeAreaView style={styles.SafeAreaViewStyle}>

                    <TextInput
                        style={styles.input}
                        multiline="true"
                        placeholder="Post on your friends page"
                        onChangeText={(text) => { this.setState({ post: text }) }}
                    />
                    <TouchableOpacity
                        onPress={() => { this.addPost() }}
                        style={styles.button}>
                        <Text>Post</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </ImageBackground>
        );
    }

    addPost = async () => {
        let id = await AsyncStorage.getItem("@userID");
        let token = await AsyncStorage.getItem("@session_token");

        let to_send = {
            text: this.state.post
        }
        return fetch(this.state.postLink + "/user/" + id + "/post", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "X-Authorization": token
            },
            body: JSON.stringify(to_send)
        })
            .then((response) => {
                Alert.alert("Post added");
                this.props.navigation.navigate("UserProfile");
            })
            .catch((error) => {
                console.log(error);
            })
    }
}


const styles = StyleSheet.create({
    input: {
        width: 300,
        height: 90,
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 15,
        fontSize: 16,
        alignSelf: "center",
        backgroundColor: 'rgba(255,255,255,0.8)',
        marginBottom: 5,
        shadowRadius: 20
    },
    button: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
        alignSelf: "center",
        backgroundColor: "#61DBFB",
    },
    image: {
        flex: 1,
        justifyContent: "center"
    },
    SafeAreaViewStyle: {
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
    }
});
export default UsersPostPage;