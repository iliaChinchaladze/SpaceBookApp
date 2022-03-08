import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Image, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import {Button, ButtonGroup, Avatar} from '@mui/material';

import SpaceBackgr from './logo/spacePic.JPG';

export default class Profile extends Component{
  constructor(props){
    super(props);

    this.state = {
      photo: null,
      isLoading: true,
      postLink: "http://localhost:3333/api/1.0.0"
    }
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if(value !== null) {
      this.setState({token:value});
    }else{
        this.props.navigation.navigate("Login");
    }
  }

  logout = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    return fetch(this.state.postLink+"/logout", {
        method: 'post',
        headers: {
            "X-Authorization": token
        }
    })
    .then((response) => {
        if(response.status === 200){
            this.props.navigation.navigate("Login");
        }else if(response.status === 401){
            this.props.navigation.navigate("Login");
        }else if(response.status === 500){
          throw'Server Error'
        }else{
            throw 'Something went wrong';
        }
    })
    .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  get_profile_image = async() => {
    let id = await AsyncStorage.getItem('@session_id');
    let token = await AsyncStorage.getItem('@session_token');
    fetch(this.state.postLink+"/user/"+id+"/photo", {
      method: 'GET',
      headers: {
        'X-Authorization': token
      }
    })
    .then((res) => {
      return res.blob();
    })
    .then((resBlob) => {
      let data = URL.createObjectURL(resBlob);
      this.setState({
        photo: data,
        isLoading: false
      });
    })
    .catch((err) => {
      console.log("error", err)
    });
  }

  componentDidMount(){
    this.get_profile_image();
  }

  render(){
    if(!this.state.isLoading){
      return (    
        <View style={styles.container}>
          <ImageBackground source={SpaceBackgr} resizeMode="cover" style={styles.image}>
          <Avatar alt="Remy Sharp" src={
              this.state.photo
            } 
            sx={{width: 200,
              height: 200, alignSelf:'center'}}
               />
          <View style = {{flexDirection:'row', justifyContent:'center'}}>
          <TouchableOpacity 
            onPress={()=>{this.logout()}}
            style={styles.button}>
                <Text>Logout</Text>
            </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>{this.props.navigation.navigate("UpdateProfile");}}
            style={styles.button}>
                <Text>Edit Profile</Text>
            </TouchableOpacity>
            </View>
            </ImageBackground>
        </View>
      );
    }else{
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }
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
    justifyContent: "center"
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    alignSelf:"center",
    backgroundColor: "#61DBFB",
  },
});