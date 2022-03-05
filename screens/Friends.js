import React, {Component} from 'react';
import {View, Text, FlatList, SearchBar, StyleSheet, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, TextInput, TouchableOpacity } from 'react-native-web';

import SpaceBackgr from './logo/spacePic.JPG';
import { green } from '@mui/material/colors';

class Friends extends Component {
    
  constructor(props){
    super(props);

    this.state = {
      friendsList:[],
      friend_id:'',
      isLoading: true,
      query:'',
      listData: [],
      requestList:[],
      postLink: "http://localhost:3333/api/1.0.0",
    }
  }


  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getData();
    this.friendRequests();
    this.showFriend();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  addFriend = async(id)=>{
    const value = await AsyncStorage.getItem('@session_token');
    
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/friends",{
      method:"POST",
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 201){
          console.log('Friend added')
      }else if(response.status === 401){
        this.props.navigation.navigate("Login");
      }else if(response.status === 403){
        console.log("User already added");
      }else{
          throw 'Something went wrong';
      }
    })
    .catch((error) => {
        console.log(error);
    })

  }
  showFriend = async()=>{
    const value = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem('@session_id');

    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/friends",{
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){


        
          return response.json()
      }else if(response.status === 401){
        this.props.navigation.navigate("Login");
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        friendsList: responseJson,
      })
    })
    .catch((error) => {
        console.log(error);
    })
  }



  acceptRequest = async(id)=>{
    const value = await AsyncStorage.getItem('@session_token');

    return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+id,{
      method: 'POST',
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          console.log('Friend added')
      }else if(response.status === 401){
        this.props.navigation.navigate("Login");
      }else if(response.status === 500){
        throw 'Server error';}else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      this.showFriend();
      this.friendRequests();
      this.setState({
        isLoading: false,
        listData: responseJson
      })
    })
    .catch((error) => {
        console.log(error);
    })

  }

  deleteRequest = async(id)=>{
    const value = await AsyncStorage.getItem('@session_token');

    return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+id,{
      method: 'DELETE',
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          console.log('Friend declined')
      }else if(response.status === 404){
        throw 'Unauthorised';
      }else if(response.status === 500){
        throw 'Server error';
      }else if(response.status === 401){
        this.props.navigation.navigate("Login");
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      this.friendRequests();
      this.setState({
        isLoading: false,
        listData: responseJson
      })
    })
    .catch((error) => {
        console.log(error);
    })

  }

  getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    let query = this.state.query;
    return fetch("http://localhost:3333/api/1.0.0/search/?q="+query, {
          'headers': {
            'X-Authorization':  value
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            listData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  friendRequests = async()=>{
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests",{
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        this.props.navigation.navigate("Login");
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        requestList: responseJson
      })
    })
    .catch((error) => {
        console.log(error);
    })
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  render() {
    
    if (this.state.isLoading){
      return (
          
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Loading..</Text>
        </View>
      );
    }else{
      return (
        <ImageBackground source={SpaceBackgr} resizeMode="cover" style={styles.image}>
        <View>
              <FlatList
                    style={styles.FriendFound}
                    data={this.state.friendsList}
                    renderItem={({item}) => (      
                        <TouchableOpacity 
                        onPress={async()=>{
                          await AsyncStorage.setItem('@userName', item.user_givenname),
                          await AsyncStorage.setItem('@userSurname', item.user_familyname),
                          await AsyncStorage.setItem('@userID', item.user_id),
                          this.props.navigation.navigate("UserProfile");}}
                          style={styles.container}>
                          <Text>{item.user_givenname} {item.user_familyname} </Text>    
                        </TouchableOpacity>                       
                    )}
                    keyExtractor={(item,index) => item.user_id.toString()}
                  />

              <FlatList
                    style={styles.FriendFound}
                    data={this.state.listData}
                    renderItem={({item}) => (
                        
                        <TouchableOpacity 
                        onPress={async()=>{
                          await AsyncStorage.setItem('@userName', item.user_givenname),
                          await AsyncStorage.setItem('@userSurname', item.user_familyname),
                          await AsyncStorage.setItem('@userID', item.user_id),
                          await AsyncStorage.setItem('@postId', item.post_id),
                          this.props.navigation.navigate("UserProfile");}}
                          style={styles.container}>
                          <Text>{item.user_givenname} {item.user_familyname} </Text>
                          <Button color="#00FF00" onPress={()=>this.addFriend(item.user_id)}/>
                        </TouchableOpacity>
                        
                    )}
                    keyExtractor={(item,index) => item.user_id.toString()}
                  />

              <TextInput
              style={styles.input}
              placeholder="Find Friends"
              onChangeText={(text)=>{this.setState({query:text})}}
              />

              <TouchableOpacity 
              onPress={()=>{this.getData()}}
              style={styles.button}>
                  <Text>Find</Text>
              </TouchableOpacity>    

              <FlatList
                    style={styles.FriendFound}
                    data={this.state.requestList}
                    renderItem={({item}) => (
                        
                        <TouchableOpacity 
                        onPress={async()=>{
                          this.props.navigation.navigate("UserProfile");}}
                          style={styles.container}>
                          <Text>{item.first_name} {item.last_name} </Text>
                           <Button color="#00FF00" onPress={()=>this.acceptRequest(item.user_id)}/>                          
                           <Button color="#FF0000" onPress={()=>this.deleteRequest(item.user_id)}/>
                        </TouchableOpacity>
                        
                    )}
                    keyExtractor={(item,index) => item.user_id.toString()}
                  />                
        </View>
        </ImageBackground>
        
      );
    }
    
  }
}

const styles = StyleSheet.create({
    container:{
      flex:1,
      margin:2,
      borderWidth:1,
      borderRadius:5,
      width:200,
      justifyContent:'space-evenly',
      alignSelf:'center',
      flexDirection: 'row',
    },
    FriendFound:{
        margin:10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 15, 
        fontSize: 16,
        alignSelf:'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
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
    asnwerBox:{
      justifyContent: "center",
      alignItems:"center"
    },
    image: {
        flex: 1,
        justifyContent: "center"
      },
    input:{
        width: 300,
        height: 30,
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 15, 
        fontSize: 16,
        textAlign:'center',
        alignSelf:'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        marginBottom:5,
        shadowRadius:20,
        padding:3,
    }
    
  });
  

export default Friends;