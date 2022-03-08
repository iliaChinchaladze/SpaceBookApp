import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ButtonGroup, Avatar } from '@mui/material';

import SpaceBackgr from './logo/spacePic.JPG';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      userSurname: '',
      isLoading: true,
      listData: [],
      postData: [],
      liked: [],
      postID: [],
      userDetails: [],
      photo: null,
      postLink: "http://localhost:3333/api/1.0.0"
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.pageReload = this.props.navigation.addListener('focus', () => {
      this.getPost();
    });

    this.getPost();
    this.getUserDetails();
    this.get_profile_image();
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.pageReload();
  }

  get_profile_image = async () => {
    let id = await AsyncStorage.getItem('@userID');
    let token = await AsyncStorage.getItem('@session_token');
    fetch(this.state.postLink + "/user/" + id + "/photo", {
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

  delPost = async(postID)=>{
    const value = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem("@userID");

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

  unlikePost = async(postID)=>{
    const value = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem("@userID");
      
    return fetch(this.state.postLink+"/user/"+id+"/post/"+postID+"/like",{
      method:"DELETE",
      headers:{
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
         this.getPost()
      }else if(response.status === 401){
          throw 'Unauthorized'
      }else if(response.status === 403){
        throw 'You have not liked this post'
      }else if(response.status === 404){
        throw 'not Found'
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

  getUserDetails = async () => {
    let id = await AsyncStorage.getItem("@userID");
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(this.state.postLink + "/user/" + id, {
      headers: {
        'X-Authorization': value
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          throw 'Unauthorized'
        } else if (response.status === 404) {
          throw 'Not Found'
        } else if (response.status === 500) {
          throw 'Server Error'
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          userDetails: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      })

  }


  likePost = async (postID) => {
    const value = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem("@userID");

    return fetch(this.state.postLink + "/user/" + id + "/post/" + postID + "/like", {
      method: "POST",
      headers: {
        'X-Authorization': value
      }
    })
      .then((response) => {
        if (response.status === 200) {
          this.getPost()
        } else if (response.status === 401) {
          throw 'Unauthorized'
        } else if (response.status === 403) {
          throw 'You have already liked this post'
        } else if (response.status === 404) {
          throw 'Not Found'
        } else if (response.status === 500) {
          throw 'Server Error'
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      })

  }


  getPost = async () => {
    let id = await AsyncStorage.getItem("@userID");
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(this.state.postLink + "/user/" + id + "/post", {
      method: "GET",
      headers: {
        'X-Authorization': value
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          throw 'Unauthorized'
        } else if (response.status === 403) {
          throw 'Can only view the posts of yourself or your friends'
        } else if (response.status === 404) {
          throw 'Not Found'
        } else if (response.status === 500) {
          throw 'Server Error'
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          postData: responseJson
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

    if (this.state.isLoading) {
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
    } else {
      return (
        <View style={{ backgroundColor: "#d0d0f7", flex: 1 }}>
          <ImageBackground source={SpaceBackgr} resizeMode="cover" style={styles.image}>
            <View style={styles.profileContainer}>

              <Avatar alt="Remy Sharp" src={
                this.state.photo
              }
                sx={{
                  width: 100,
                  height: 100,
                }}
              />

              <Text style={{ fontFamily: 'italic', fontSize: 18, alignSelf: 'center' }}> {this.state.userDetails.first_name}{this.state.userDetails.last_name} </Text>

            </View>
            <TouchableOpacity style={{ width: "50%", backgroundColor: 'rgba(25,118,211,0.8)', alignSelf: 'center', marginBottom: 10, borderRadius: 4, }}
              onPress={() => this.props.navigation.navigate('Friends')}><Text style={{ textAlign: 'center' }}>Go Home</Text></TouchableOpacity>

            <TouchableOpacity style={{ width: "50%", backgroundColor: 'rgba(25,118,211,0.8)', alignSelf: 'center', marginBottom: 10, borderRadius: 4, }}
              onPress={() => this.props.navigation.navigate('UsersPostPage')}><Text style={{ textAlign: 'center' }}>Add Post</Text></TouchableOpacity>
            <FlatList
              data={this.state.postData}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity onPress={async()=>{
                        await AsyncStorage.setItem('@postId', item.post_id),
                        await AsyncStorage.setItem('@posterID', item.author.user_id),
                        this.props.navigation.navigate("SinglePostOther");}}>
                  <View style={styles.postContainer}>
                    <Text style={{ fontFamily: 'italic', fontSize: 18 }}> {item.author.first_name} : {item.text} </Text>
                  </View>
                  </TouchableOpacity>
                  <View style={{ alignSelf: 'center', marginBottom: 10, justifyContent: 'space-evenly', flexDirection: 'row', width: "50%", backgroundColor: 'rgba(255,255,255,0.5)', padding: 10, borderRadius: 5 }}>
                    <TouchableOpacity onPress={() => this.likePost(item.post_id)}><Text>{item.numLikes}👍</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.unlikePost(item.post_id)}><Text>👎</Text></TouchableOpacity>                   
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => item.post_id.toString()}
            />
          </ImageBackground>
        </View>
      );
    }

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
    alignSelf: "center"
  },
  button: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    alignSelf: "center",
    backgroundColor: "#61DBFB",
  },
  postContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(25,118,211,0.8)',
    shadowColor: 'black',
    shadowRadius: 10
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  profileContainer: {
    height: 110,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 2,
    marginTop: 10,
    flexDirection: 'row',
    borderRadius: 20,
    shadowRadius: 10,
    marginBottom: 10
  }
});


export default UserProfile;