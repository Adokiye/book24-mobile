import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl} from 'react-native';
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
  const [eventTickets, setEventTickets] = useState([]);
  const [tourBookings, setTourBookings] = useState([]);
  const [rentalBookings, setRentalBookings] = useState([]);
  const [carBookings, setCarBookings] = useState([]);
  const [cruiseBookings, setCruiseBookings] = useState([]);

  /**
   * render Item
   *
   * @param {*} item
   * @returns
   */

  useEffect(() => {
    //   this.setState({loader:true})
    getBookings();
  }, []);

  const getBookings = async () => {
    let token = await AsyncStorage.getItem('token');
    console.log(token);
    var config = {
      headers: {Authorization: 'Bearer ' + token},
      timeout: 20000,
    };
    axios
      .get(BASE_URL + 'hotelBookings', config)
      .then((response) => {
        console.log(response);
        if (response.data.message == 'Token is not valid') {
          //      router.push("/");
        }
        var len = response.data.rows.length;
        setBookingHistory(response.data.rows);
        getEventTickets(token);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getEventTickets = async (token) => {
    var config = {
      headers: {Authorization: 'Bearer ' + token},
      timeout: 20000,
    };
    axios
      .get(BASE_URL + 'eventTickets', config)
      .then((response) => {
        console.log(response);
        if (response.data.message == 'Token is not valid') {
          //      router.push("/");
        }
        var len = response.data.rows.length;
        setEventTickets(response.data.rows);
        getTourBookings(token);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTourBookings = async (token) => {
    var config = {
      headers: {Authorization: 'Bearer ' + token},
      timeout: 20000,
    };
    axios
      .get(BASE_URL + 'tourBookings', config)
      .then((response) => {
        console.log(response);
        if (response.data.message == 'Token is not valid') {
          //      router.push("/");
        }
        var len = response.data.rows.length;
        setTourBookings(response.data.rows);
        getRentalBookings(token);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRentalBookings = async (token) => {
    var config = {
      headers: {Authorization: 'Bearer ' + token},
      timeout: 20000,
    };
    axios
      .get(BASE_URL + 'tourBookings', config)
      .then((response) => {
        console.log(response);
        if (response.data.message == 'Token is not valid') {
          //      router.push("/");
        }
        var len = response.data.rows.length;
        setRentalBookings(response.data.rows);
        getCarBookings(token);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCarBookings = async (token) => {
    var config = {
      headers: {Authorization: 'Bearer ' + token},
      timeout: 20000,
    };
    axios
      .get(BASE_URL + 'carBookings', config)
      .then((response) => {
        console.log(response);
        if (response.data.message == 'Token is not valid') {
          //      router.push("/");
        }
        var len = response.data.rows.length;
        setCarBookings(response.data.rows);
        getCruiseBookings(token);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCruiseBookings = async (token) => {
    var config = {
      headers: {Authorization: 'Bearer ' + token},
      timeout: 20000,
    };
    axios
      .get(BASE_URL + 'cruiseBookings', config)
      .then((response) => {
        console.log(response);
        if (response.data.message == 'Token is not valid') {
          //      router.push("/");
        }
        var len = response.data.rows.length;
        setCruiseBookings(response.data.rows);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const renderItem = (item, type) => {
    let check_in_date = '';
    let check_out_date = '';
    if (type == 'hotel') {
      check_in_date = item.check_in_date;
      check_out_date = item.check_out_date;
    } else if (type == 'rental') {
      check_in_date = item.start_date;
      check_out_date = item.end_date;
    } else if (type == 'car') {
      check_in_date = item.pickup_date;
      check_out_date = item.dropoff_date;
    } else {
      check_in_date = item[type].start_date;
      check_out_date = item[type].end_date;
    }
    return (
      <BookingHistory
        name={item.name}
        checkIn={check_in_date}
        checkOut={check_out_date}
        total={item.ref}
        price={item.price}
        style={{paddingVertical: 10, marginHorizontal: 20}}
        onPress={() => {
          //  navigation.navigate('BookingDetail',{item});
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
        renderItem={({item}) => renderItem(item, 'hotel')}
      />
      <FlatList
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={() => {}}
          />
        }
        data={eventTickets}
        keyExtractor={(item, index) => item.id}
        renderItem={({item}) => renderItem(item, 'event')}
      />
      <FlatList
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={() => {}}
          />
        }
        data={tourBookings}
        keyExtractor={(item, index) => item.id}
        renderItem={({item}) => renderItem(item, 'tour')}
      />
      <FlatList
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={() => {}}
          />
        }
        data={rentalBookings}
        keyExtractor={(item, index) => item.id}
        renderItem={({item}) => renderItem(item, 'rental')}
      />
      <FlatList
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={() => {}}
          />
        }
        data={carBookings}
        keyExtractor={(item, index) => item.id}
        renderItem={({item}) => renderItem(item, 'car')}
      />
      <FlatList
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={() => {}}
          />
        }
        data={cruiseBookings}
        keyExtractor={(item, index) => item.id}
        renderItem={({item}) => renderItem(item, 'cruise')}
      />
    </SafeAreaView>
  );
}
