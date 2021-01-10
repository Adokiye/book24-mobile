import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Images, BaseColor, useTheme} from '@config';
import {Image, Text} from '@components';
import styles from './styles';
import {useDispatch} from 'react-redux';
import {AuthActions} from '@actions';
import AsyncStorage from '@react-native-community/async-storage';

export default function Loading({navigation}) {
  const {colors} = useTheme();
  const dispatch = useDispatch();

  const onProcess = async () => {
    let token = await AsyncStorage.getItem('token');
    if (token != null && token != '') {
      dispatch(
        AuthActions.authentication(true, (response) => {
          //  navigation.navigate('Home');
        }),
      );
    }
    setTimeout(() => {
      navigation.replace('Main');
    }, 500);
  };
  useEffect(() => {
    console.log('loading');
    onProcess();
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: '#fff'}]}>
      <Image source={Images.logoGif} style={styles.logo} resizeMode="contain" />
      <View style={styles.content}>
        {/* <Text title1 whiteColor semibold>
          Book24
        </Text> */}
        <ActivityIndicator
          size="large"
          color={'#1281dd'}
          style={{
            marginTop: 50,
          }}
        />
      </View>
    </View>
  );
}
