import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import {BaseStyle, useTheme, BASE_URL} from '@config';
import {Header, SafeAreaView, Icon, Button, TextInput} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {AuthActions} from '@actions';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';


export default function SignUp({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    name: true,
    email: true,
    password: true,
    mobileNumber: true
  });

  /**
   * call when action signup
   *
   */
  const onSignUp = () => {
    if (name == '' || email == '' || password == ''||mobileNumber=='') {
      setSuccess({
        ...success,
        name: name != '' ? true : false,
        email: email != '' ? true : false,
        password: password != '' ? true : false,
        mobileNumber: mobileNumber != '' ? true : false,
      });
    } else {
      setLoading(true);
      var bodyParameters = {
        full_name:name,
        mobile_number: mobileNumber,
        username:name + Math.floor(Math.random() * 10000).toString(),
        role: 'guest',
        email,
        password
      };
      console.log(bodyParameters)
      axios
        .post(BASE_URL + "user", bodyParameters, {
          timeout: 20000,
        })
        .then(async (response) => {
          console.log(response);
          let id = response.data.user.id;
          let token = response.data.authToken.token;
          let role = response.data.user.role;
          let name = response.data.user.full_name;
          let email = response.data.user.email;
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('id', id.toString());
          await AsyncStorage.setItem('role', role);
          await AsyncStorage.setItem('name', name);
          await AsyncStorage.setItem('email', email);
          return dispatch(
            AuthActions.authentication(true, (response) => {
              navigation.navigate('Home');
            }),
          );
        })
        .catch((error) => {
          console.log(error);
          Toast.show(error.response.data.message||error.response.data||'Email already exists');
          console.log(JSON.stringify(error.response.data));
        }).finally(()=>setLoading(false));
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('sign_up')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{flex: 1}}>
        <View style={styles.contain}>
          <TextInput
            onChangeText={(text) => setName(text)}
            placeholder={'Enter Full Name'}
            success={success.name}
            value={name}
          />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={(text) => setEmail(text)}
            placeholder={t('input_email')}
            keyboardType="email-password"
            success={success.email}
            value={email}
          />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={(text) => setPassword(text)}
            placeholder={t('input_password')}
            success={success.password}
            value={password}
          />
            <TextInput
            style={{marginTop: 10}}
            onChangeText={(text) => setMobileNumber(text)}
            placeholder={'Enter Mobile Number'}
            keyboardType="numeric"
            success={success.mobileNumber}
            value={mobileNumber}
          />
          <Button
            full
            style={{marginTop: 20}}
            loading={loading}
            onPress={() => onSignUp()}>
            {t('sign_up')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
