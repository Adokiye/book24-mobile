import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {AuthActions} from '@actions';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {BaseStyle, useTheme, BASE_URL} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import styles from './styles';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';

export default function SignIn({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({id: true, password: true});

  /**
   * call when action login
   *
   */
  const onLogin = () => {
    if (id == '' || password == '') {
      setSuccess({
        ...success,
        id: false,
        password: false,
      });
    } else {
      setLoading(true);
      var bodyParameters = {
        email: id,
        password: password,
      };
      axios
        .post(BASE_URL + 'login', bodyParameters, {
          timeout: 20000,
        })
        .then(async (response) => {
          console.log(response);
          let id = response.data.user.id;
          let token = response.data.authToken.token;
          let role = response.data.user.role;
          let name = response.data.user.full_name;
          let email = response.data.user.email;
          console.log(token)
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('id', id.toString());
          await AsyncStorage.setItem('role', role);
          await AsyncStorage.setItem('name', name);
          await AsyncStorage.setItem('email', email);
          return dispatch(
            AuthActions.authentication(true, (response) => {
              navigation.goBack();
            }),
          );
        })
        .catch((error) => {
          console.log(error.response);
          Toast.show(error.response.data.message||error.response.data);
          console.log(JSON.stringify(error.response.data));
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('sign_in')}
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
            onChangeText={(text) => setId(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                id: true,
              });
            }}
            placeholder={'Enter Email'}
            success={success.id}
            value={id}
          />
          <TextInput
            style={{marginTop: 10}}
            onChangeText={(text) => setPassword(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                password: true,
              });
            }}
            placeholder={t('input_password')}
            secureTextEntry={true}
            success={success.password}
            value={password}
          />
          <Button
            style={{marginTop: 20}}
            full
            loading={loading}
            onPress={() => {
              onLogin();
            }}>
            {t('sign_in')}
          </Button>
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPassword')}>
            <Text body1 grayColor style={{marginTop: 25}}>
              {t('forgot_your_password')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
