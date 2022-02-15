import React, { Component } from 'react';
import { Text, View,Button } from 'react-native';

class Signup extends Component{

  
  render(){
    return(
        <View>
          <Text>Signup</Text>
          <Button
            title="Go back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
        
    );
  }
}

export default Signup;
