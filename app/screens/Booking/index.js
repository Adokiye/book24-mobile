import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl,} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {BaseStyle, useTheme, BASE_URL} from '@config';
import {Header, SafeAreaView, BookingHistory} from '@components';
import {BookingHistoryData} from '@data';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import axios from 'axios';

export default function Booking({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();

  const [refreshing] = useState(false);
  const [bookingHistory, setBookingHistory] = useState([]);

  /**
   * render Item
   *
   * @param {*} item
   * @returns
   */

   useEffect(()=>{
 //   this.setState({loader:true})
getBookings()
   },[])

   const getBookings = async()=>{
    let token = await AsyncStorage.getItem('token')
    console.log(token)
    var config = {
      headers: { Authorization: "Bearer " + token },
      timeout: 20000,
      };
      axios
        .get(BASE_URL + "hotelBookings", config)
        .then((response) => {
          console.log(response);
          if (response.data.message == "Token is not valid") {
            //      router.push("/");
          }
          var len = response.data.rows.length;
          setBookingHistory(response.data.rows)
     //      this.getEventTickets();
        })
        .catch((error) => {
          console.log(error);
        });
   }
  const renderItem = item => {
    return (
      <BookingHistory
        name={item.name}
        checkIn={item.check_in_date}
        checkOut={item.check_out_date}
        total={item.ref}
        price={item.price}
        style={{paddingVertical: 10, marginHorizontal: 20}}
        onPress={() => {
          navigation.navigate('BookingDetail',{item});
        }}
      />
    );
  };

  /**
   * @description Loading booking item history one by one
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header title={t('booking_history')} />
      <FlatList
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={() => {}}
          />
        }
        data={bookingHistory}
        keyExtractor={(item, index) => item.id}
        renderItem={({item}) => renderItem(item)}
      />
    </SafeAreaView>
  );
}
