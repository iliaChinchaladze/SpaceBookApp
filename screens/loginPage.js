import React, { Component } from 'react';
import { StyleSheet, Text, View, Button,  TextInput, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password:"",
      postLink: "http://10.0.2.2:3333/api/1.0.0"
    }
  }
  render(){
    return(
      <View style={styles.container}>
        <Image 
          style={{width:150,height:190, alignSelf:'center'}}
          source={require("./logo/spacebook-logos_transparent.png")}
        />
        <TextInput
        style={styles.input}
        placeholder="login"
        onChangeText={(text)=>{this.setState({email:text})}}
        />
        <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text)=>{this.setState({password:text})}}
        />
        <View style={{justifyContent: 'space-between',margin:20}}>
            <Button style={styles.button}
              title="Log in"
              onPress={()=>{this.login()}}
            />
            <Text style={{alignSelf:"center"}} >or</Text>
            <Button style={styles.button}
              title="Sign up"
              onPress={() => this.props.navigation.navigate('signupPage')}
            />
        </View>
      </View>       
    );
  }

  login = async() =>{
    return fetch(this.state.postLink+"/login", {
     method:"POST",
     headers:{"Content-Type":"application/json"},
     body: JSON.stringify({
       email: this.state.email,
       password: this.state.password
     })
    })
    .then((response)=>{
      if(response.status === 200){
        return response.json()
      }else if(response.status === 400){
        throw 'Invalid email or password';
      }else{
        throw 'Something went wrong';
      }
    })
    .then(async (responseJson) => {
      
      let id = JSON.stringify(responseJson.id);
      console.log(responseJson);
      await AsyncStorage.setItem('@session_id', id);
      await AsyncStorage.setItem('@session_token', responseJson.token);
      this.props.navigation.navigate("Main");
    })
    .catch((error) => {
      console.log(error);
   });
  }
}

const styles = StyleSheet.create({
  container:{
    margin:30,
    alignSelf:"center",
    alignItems: 'center',
    justifyContent: 'center'
  },
  input:{
    width: 300,
    height: 40,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15, 
    fontSize: 16,
    alignSelf:"center",
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  button:{
    margin:10,
    marginVertical:20,
  }
});

export default Login;
