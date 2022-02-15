import React, { Component } from 'react';
import { Text, View,Button } from 'react-native';

class MainP extends Component{
  render(){
    return(
        <View>
          <Text>Main Page</Text>
          <Button
            title="Go back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
    );
  }
}

export default MainP;
