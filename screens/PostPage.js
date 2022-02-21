import React, { Component } from 'react';
import { StyleSheet, Text, View,TextInput, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

class PostPage extends Component{
    constructor(props){
      super(props);
  
      this.state = {
          id:'',
          post:""
      }  
  }
  render(){
      return(
        <View>
            <TextInput
            style={styles.input}
            placeholder="What's on your mind?"
            onChangeText={(text)=>{this.setState({post:text})}}
            />
            <TouchableOpacity 
            onPress={()=>{this.addPost()}}
            style={styles.button}>
                <Text>Post</Text>
            </TouchableOpacity>
        </View>
      );
  }

  addPost = async () =>{
      let id = await AsyncStorage.getItem("@session_id");
      let token = await AsyncStorage.getItem("@session_token");

      let to_send ={
        text:this.state.post
      }
      return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+ id + "/post", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "X-Authorization": token
          },
        body: JSON.stringify(to_send)
      })
      .then((response) => {
        Alert.alert("Post added");
        this.props.navigation.navigate("Home");
      })
      .catch((error) => {
        console.log(error);
      })
      }
}


const styles = StyleSheet.create({
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
        alignSelf:"center"
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
    }
  });
export default PostPage;