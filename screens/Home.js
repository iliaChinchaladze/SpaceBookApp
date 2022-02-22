import React, {Component} from 'react';
import {View, Text, FlatList,TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      postData:[],
      liked: [],
      postID:[],
      postLink: "http://10.0.2.2:3333/api/1.0.0"
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getData();
    this.getPost();
    this.likePost();
    this.delPost();
  }
  /*
  componentDidUpdate(){
    this.getPost();
  }
  */
  componentWillUnmount() {
    this.unsubscribe();
  }

  delPost = async(postID)=>{
    const value = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem("@session_id");

    return fetch(this.state.postLink+"/user/"+id+"/post/"+postID,{
      method:'DELETE',
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

  likePost = async(postID)=>{
    const value = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem("@session_id");
      
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


  getPost = async()=>{
    let id = await AsyncStorage.getItem("@session_id");
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(this.state.postLink+"/user/"+ id + "/post",{
      method: "GET",
      headers: {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
          throw 'Unauthorized'
      }else{
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





  getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(this.state.postLink+"/search", {
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
        <View style={{backgroundColor:"#d0d0f7"}}>
          <View style={styles.profileContainer}>

          </View>
          <FlatList
                data={this.state.listData} 
                renderItem={({item}) => (
                    <View>
                      <Text>{item.user_givenname} {item.user_familyname} </Text>
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
  
          <FlatList
                data={this.state.postData}
                renderItem={({item}) =>(
                  <View style={styles.postContainer}>
                    <Text> Post By  {item.author.first_name}  {item.text} 
                      <TouchableOpacity
                        onPress={()=>this.likePost(item.post_id)}
                        style={styles.button}>
                          <Text>{item.numLikes} 👍</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={()=>this.delPost(item.post_id)}
                        style={styles.button}>
                          <Text>Del ❌</Text>
                      </TouchableOpacity>
                    </Text>
                  </View>
                )}
                keyExtractor={(item,index) => item.post_id.toString()}
                />
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
      alignSelf:"center"
  },
  button: {
      width: 80,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 100,
      alignSelf:"center",
      backgroundColor: "#61DBFB",
  },
  postContainer:{
    flex:1,
    padding:20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#f4f4f4',
    borderWidth:1,
    borderRadius: 100,
  },
  profileContainer:{
    height:170,
    backgroundColor: '#babbf5',
    borderWidth:2
  }
});


export default Home;