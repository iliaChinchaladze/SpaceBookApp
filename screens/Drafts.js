import React, { Component } from 'react';
import {
  StyleSheet, Text, FlatList, SafeAreaView, ImageBackground, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SpaceBack from './logo/spacePic.JPG';

class Drafts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draftData: [],
    };
  }

  componentDidMount() {
    this.getDraft();
  }

  getDraft = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('@draftPost'));
    this.setState({ draftData: data });
  };

  saveDraft = async (item) => {
    console.log(item);
    await AsyncStorage.setItem('@currentDraft', JSON.stringify(item));
    this.props.navigation.navigate('PostDraft');
  };

  deleteDraft = async (item) => {
    const drafts = JSON.parse(await AsyncStorage.getItem('@draftPost'));
    const newDrafts = [];
    for (let i = 0; i < drafts.length; i += 1) {
      const draftText = drafts[i].text;
      const draftId = drafts[i].id;
      if (draftId !== item) {
        newDrafts.push({ id: draftId, text: draftText });
      }
    }
    await AsyncStorage.setItem('@draftPost', JSON.stringify(newDrafts));
    this.getDraft();
  };

  render() {
    return (
      <ImageBackground source={SpaceBack} resizeMode="cover" style={styles.image}>
        <SafeAreaView style={styles.SafeAreaViewStyle}>
          <FlatList
            data={this.state.draftData}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => this.saveDraft(item)}
              >
                <Text style={styles.input}>
                  {item.text}
                </Text>
                <TouchableOpacity
                  onPress={() => { this.deleteDraft(item.id); }}
                  style={styles.button}
                >
                  <Text>❌</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.text.toString()}
          />
          <TouchableOpacity
            style={{
              width: '50%', backgroundColor: 'rgba(25,118,211,0.8)', alignSelf: 'center', marginBottom: 10, borderRadius: 4,
            }}
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={{ textAlign: 'center' }}>Go Back</Text>

          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
    shadowRadius: 20,
  },
  button: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#61DBFB',
    marginBottom: 5,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  SafeAreaViewStyle: {
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
});
export default Drafts;
