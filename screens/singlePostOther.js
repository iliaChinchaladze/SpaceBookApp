import React, { Component } from 'react';
import { StyleSheet, Text, View,TextInput, Alert, SafeAreaView, ImageBackground, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

import SpaceBackgr from './logo/spacePic.JPG';

class SinglePostOther extends Component{
    constructor(props){
      super(props);
  
      this.state = {
          postData:[],
          postUserId:'',
          ID:'',
          post:"",
          postLink: "http://localhost:3333/api/1.0.0"
      }  
  }
  componentDidMount() {
    this.pageReload = this.props.navigation.addListener('focus',()=>{
      this.getPost();
    });
    this.getPost();
  }
  render (){
      if(this.state.ID == this.state.postUserId){
        return(
            <ImageBackground source={SpaceBackgr} resizeMode="cover" style={styles.image}>
              <SafeAreaView style={styles.SafeAreaViewStyle}>             
                  <TextInput
                  style={styles.input}
                  multiline = "true"
                  placeholder={(this.state.postData.text)}
                  onChangeText={(text)=>{this.setState({post:text})}}
                  />
                  <View style={{flexDirection:'row'}}>  
                  <TouchableOpacity 
                  onPress={()=>{this.likePost()}}
                  style={styles.button}>
                      <Text>👍</Text>
                  </TouchableOpacity>  
    
                  <TouchableOpacity 
                  onPress={()=>{this.delPost()}}
                  style={styles.button}>
                      <Text>❌</Text>
                  </TouchableOpacity>
    
                  <TouchableOpacity 
                  onPress={()=>{this.updatePost()}}
                  style={styles.button}>
                      <Text>🖊</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                  onPress={() => this.props.navigation.goBack()}
                  style={styles.button}>
                    <Text>🏡</Text>
                  </TouchableOpacity>
                 </View>
              </SafeAreaView>
            </ImageBackground>
          ); 
      }
      else{
          return(
            <ImageBackground source={SpaceBackgr} resizeMode="cover" style={styles.image}>
            <SafeAreaView style={styles.SafeAreaViewStyle}>             
                <TextInput
                style={styles.input}
                multiline = "true"
                placeholder={(this.state.postData.text)}
                onChangeText={(text)=>{this.setState({post:text})}}
                />
                <View style={{flexDirection:'row'}}>
                  
                <TouchableOpacity 
                onPress={()=>{this.likePost()}}
                style={styles.button}>
                    <Text>👍</Text>
                </TouchableOpacity>    

                <TouchableOpacity 
                onPress={() => this.props.navigation.goBack()}
                style={styles.button}>
                    <Text>🏡</Text>
                </TouchableOpacity>
                </View>  
        
            </SafeAreaView>
            </ImageBackground>
            );
      }
         
  }


  getPost = async()=>{
    let id = await AsyncStorage.getItem("@userID");
    const value = await AsyncStorage.getItem('@session_token');;
    let postID = await AsyncStorage.getItem("@postId");
    
    let myID= await AsyncStorage.getItem("@session_id");

    return fetch(this.state.postLink+"/user/"+ id + "/post/"+postID,{
      headers: {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
          throw 'Unauthorized'
      }else if(response.status === 403){
        throw 'Can only view the posts of yourself or your friends'
      }else if(response.status === 404){
        throw 'Not Found'
      }else if(response.status === 500){
        throw 'Server error'
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        postData: responseJson,
        ID:myID,
        postUserId: responseJson.author.user_id,
      })
    })
    .catch((error) => {
        console.log(error);
    })   
  }

  likePost = async()=>{
    const value = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem("@session_id");
    let postID = await AsyncStorage.getItem("@postId");
      
    return fetch(this.state.postLink+"/user/"+id+"/post/"+postID+"/like",{
      method:"POST",
      headers:{
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
          throw 'Unauthorized'
      }else if(response.status === 403){
        throw 'You have already liked this post'
      }else if(response.status === 404){
        throw 'Not found'
      }else if(response.status === 500){
        throw 'Server Error'
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
        isLoading: false,
        liked: responseJson
      })
    })
    .catch((error) => {
        console.log(error);
    }) 

  }

  updatePost = async()=>{
    const value = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem("@userID");
    let postID = await AsyncStorage.getItem("@postId");

    return fetch (this.state.postLink+"/user/"+id+"/post/"+postID,{
      method:"PATCH",
      headers:{
        'X-Authorization':  value,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        text: this.state.post
      })
    })
    .then((response) => {
      if(response.status === 200){
          console.log("post updated")
        this.props.navigation.goBack();
      }else if(response.status === 400){
        throw 'Bad request'
      }else if(response.status === 401){
          throw 'Unauthorized'
      }else if(response.status === 403){
        throw 'Forbidden - you can only update your own posts'
      }else if(response.status === 404){
        throw 'Not Found'
      }else if(response.status === 500){
        throw 'Server Error'
      }else{
          throw 'Something went wrong';
      }
    })
    .catch((error) => {
      console.log(error);
    })
    
  }

  delPost = async()=>{
    const value = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem("@session_id");
    let postID = await AsyncStorage.getItem("@postId");

    return fetch(this.state.postLink+"/user/"+id+"/post/"+postID,{
      method:'DELETE',
      headers:{
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          this.getPost();
      }else if(response.status === 401){
          throw 'Unauthorized'
      }else if(response.status === 403){
        throw 'Forbidden'
      }else if(response.status === 404){
        throw 'Not Found'
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      console.log(responseJson)
      this.setState({
        isLoading: false,
        
      })
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
        alignSelf:"center",
        backgroundColor: 'rgba(255,255,255,0.8)',
        marginBottom:5,
        shadowRadius:20
    },
    button: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
        alignSelf:"center",
        backgroundColor: "#61DBFB",
    },
    image: {
      flex: 1,
      justifyContent: "center"
    },
    SafeAreaViewStyle:{

      alignItems: 'center',
      alignContent: 'center',
      alignSelf:'center',
    }
  });
export default SinglePostOther;