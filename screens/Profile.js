import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Image, Text, View } from 'react-native';


export default class Profile extends Component{
  constructor(props){
    super(props);

    this.state = {
      photo: null,
      isLoading: true
    }
  }

  get_profile_image = async() => {
    let id = await AsyncStorage.getItem('@session_id');
    let token = await AsyncStorage.getItem('@session_token');
    fetch("http://10.0.2.2:3333/api/1.0.0/user/"+id+"/photo", {
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
          <Image
            source={{
              uri: this.state.photo,
            }}
            style={{
              resizeMode: "contain",
              width: 400,
              height: 400,
              borderWidth: 5 
            }}
          />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});