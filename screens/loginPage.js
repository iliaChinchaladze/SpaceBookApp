import React, { Component } from 'react';
import { StyleSheet, Text, View, Button,  TextInput, Alert, Image } from 'react-native';

class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password:""
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
 
        <Button style={styles.button}
          title="Log in"
          //onPress={() => this.props.navigation.navigate('mainPage')}
          onPress={()=>{this.login()}}
        />
        <Button style={styles.button}
          title="Sign up"
          onPress={() => this.props.navigation.navigate('signupPage')}
        />
      </View>       
    );
  }

  login = async() =>{
    return fetch("http://localhost:3333/api/1.0.0/login", {
     method:"post",
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
      console.log(responseJson);
      await AsyncStorage.setItem('@session_token', responseJson.token);
      this.props.navigation.navigate("mainPage");
    })
    .catch((error) => {
      console.log(error);
   });
  }
}

const styles = StyleSheet.create({
  container:{
    margin:30
  },
  input:{
    height: 40,
    margin: 20,
    borderWidth: 1,
    padding: 10,
  },
  button:{
    margin:10,
    marginVertical:20,
    
  },
});

export default Login;
