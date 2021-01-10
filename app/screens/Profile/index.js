import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {AuthActions} from '@actions';
import {BaseStyle, useTheme, BASE_URL} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfileDetail,
  ProfilePerformance,
} from '@components';
import styles from './styles';
import {UserData} from '@data';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export default function Profile({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [userData,setUserData] = useState([]);
  const dispatch = useDispatch();

  /**
   * @description Simple logout with Redux
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */

   useEffect(()=>{
    getData()
   },[])
  const onLogOut = async() => {
    setLoading(true);
    await AsyncStorage.clear();
    dispatch(AuthActions.authentication(false, response => {}));
  };

  const getData = async() => {
    let token = await AsyncStorage.getItem('token')
    var config = {
      headers: { Authorization: "Bearer " + token },
      timeout: 20000,
    };
    axios
      .get(BASE_URL + "me", config)
      .then((response) => {
        if (response.data.message == "Token is not valid") {
          //      router.push("/");
        }
        
        let res = response.data;
        console.log(res)
        const data = {
          full_name: res.full_name,
          email: res.email,
          mobile_number: res.mobile_number,
          username: '@'+res.username,
          image:res.photo_url||''
        };
        setUserData(data)
      })
      .catch((error) => {
        //   router.push("/");
        console.log(error.response);
      });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('profile')}
        renderRight={() => {
          return <Icon name="bell" size={24} color={colors.primary} />;
        }}
        onPressRight={() => {
          navigation.navigate('Notification');
        }}
      />
      <ScrollView>
        <View style={styles.contain}>
          <ProfileDetail
            image={userData.image}
            textFirst={userData.full_name}
            point={''}
            textSecond={userData.mobile_number}
            textThird={userData.username}
            onPress={() => {}}
          />
          {/* <ProfilePerformance
            data={userData.performance}
            style={{marginTop: 20, marginBottom: 20}}
          /> */}
          <TouchableOpacity
            style={[
              styles.profileItem,
              {borderBottomColor: colors.border, borderBottomWidth: 1},
            ]}
            onPress={() => {
              navigation.navigate('ProfileEdit');
            }}>
            <Text body1>{t('edit_profile')}</Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              style={{marginLeft: 5}}
              enableRTL={true}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.profileItem,
              {borderBottomColor: colors.border, borderBottomWidth: 1},
            ]}
            onPress={() => {
              navigation.navigate('ChangePassword');
            }}>
            <Text body1>{t('change_password')}</Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              style={{marginLeft: 5}}
              enableRTL={true}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.profileItem,
              {borderBottomColor: colors.border, borderBottomWidth: 1},
            ]}
            onPress={() => {
              navigation.navigate('Currency');
            }}>
            <Text body1>{t('currency')}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text body1 grayColor>
                NGN
              </Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.profileItem,
              {borderBottomColor: colors.border, borderBottomWidth: 1},
            ]}
            onPress={() => navigation.navigate('MyPaymentMethod')}>
            <Text body1>{t('my_cards')}</Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              style={{marginLeft: 5}}
              enableRTL={true}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileItem}
            onPress={() => {
              navigation.navigate('Setting');
            }}>
            <Text body1>{t('setting')}</Text>
            <Icon
              name="angle-right"
              size={18}
              color={colors.primary}
              style={{marginLeft: 5}}
              enableRTL={true}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
        <Button full loading={loading} onPress={() => onLogOut()}>
          {t('sign_out')}
        </Button>
      </View>
    </SafeAreaView>
  );
}
