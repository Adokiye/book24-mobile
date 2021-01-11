import React, {useEffect} from 'react';
import {ActivityIndicator, View,StatusBar} from 'react-native';
import {Images, BaseColor, useTheme} from '@config';
import {Image, Text} from '@components';
import styles from './styles';
import {useDispatch} from 'react-redux';
import {AuthActions} from '@actions';
import AsyncStorage from '@react-native-community/async-storage';
import {BaseSetting} from '@config';
import SplashScreen from 'react-native-splash-screen';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {useSelector} from 'react-redux';
import {DarkModeProvider, useDarkMode} from 'react-native-dark-mode';

export default function Loading({navigation}) {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const storeLanguage = useSelector(state => state.application.language);
  const isDarkMode = useDarkMode();



  const onProcess = async () => {
    let token = await AsyncStorage.getItem('token');
    if (token != null && token != '') {
      await dispatch(
        await AuthActions.authentication(true, (response) => {
          //  navigation.navigate('Home');
        }),
      );
    }
    i18n.use(initReactI18next).init({
      resources: BaseSetting.resourcesLanguage,
      lng: storeLanguage ?? BaseSetting.defaultLanguage,
      fallbackLng: BaseSetting.defaultLanguage,
    });
    console.log('ddd')
  SplashScreen.hide();
    StatusBar.setBackgroundColor(colors.primary, true);
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
      navigation.replace('Main');
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
