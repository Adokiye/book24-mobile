import React,{useState} from 'react';
import {View, ScrollView, TouchableOpacity,TextInput} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Button} from '@components';
import styles from './styles';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { connect, useDispatch } from "react-redux";
import {
  setOrderUrl,
  setOrderData,
  setOrderPrice,
  setOrderCheckInDate,
  setOrderCheckOutDate,
  setOrderImage,
  setOrderName,
  setOrderSubData,
  setOrderSubName,
} from "../../actions/order";

const PreviewBooking =({navigation,route,order})=> {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible_, setDatePickerVisibility_] = useState(false);
  const {item,parentData} = route
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {colors} = useTheme();
  const [adultNo, setAdultNo] = useState('')
  const [childrenNo, setChildrenNo] = useState('')
  const [checkInDate, setCheckInDate] = useState(new Date())
  const [checkOutDate, setCheckOutDate] = useState(new Date())

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (data) => {
    console.warn('A date has been picked: ', data);
    setCheckInDate(data);
    hideDatePicker();
  };

    const showDatePicker_ = () => {
    setDatePickerVisibility_(true);
  };

  const hideDatePicker_ = () => {
    setDatePickerVisibility_(false);
  };

  const handleConfirm_ = (data) => {
    console.warn('A date has been picked: ', data);
    setCheckOutDate(data);
    hideDatePicker_();
  };
  let a = moment(checkInDate);
  let b = moment(checkOutDate);
  let no_of_days = Math.abs(a.diff(b, 'days'))||1;

  const book = async () => {
    let token = await AsyncStorage.getItem('token')
    if (token == null ||token == "") {
      return navigation.navigate("SignIn")
    }  else {
      let new_data = order.data
      new_data.check_in_date = checkInDate
      new_data.check_out_date = checkOutDate
      new_data.no_of_adults = adultNo
      new_data.no_of_children = childrenNo
      dispatch(setOrderData(new_data))
      dispatch(setOrderCheckInDate(moment(checkInDate).format('MMMM DDDD YYYY HH:mm:ss')))
      dispatch(setOrderCheckOutDate(moment(checkOutDate).format('MMMM DDDD YYYY HH:mm:ss')))
      return navigation.navigate("CheckOut");
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('preview_booking')}
       // subTitle="Booking Number GAX02"
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
      <ScrollView>
        <View style={{paddingHorizontal: 20}}>
        <Text headline>{'No of Adults'}</Text>
          <TextInput
            style={{marginTop: 10}}
            onChangeText={(text) => setAdultNo(text)}
            placeholder={'Enter number of adults'}
         //   success={success.card}
            keyboardType="numeric"
            value={adultNo}
          />
          <Text headline>{'No of Children'}</Text>
          <TextInput
            style={{marginTop: 10}}
            onChangeText={(text) => setChildrenNo(text)}
            placeholder={'Enter number of children'}
         //   success={success.card}
            keyboardType="numeric"
            value={childrenNo}
          />
          <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
            <Text body2 style={{marginBottom: 10}}>
              {t('hotels')}
            </Text>
            <Text body1 semibold>
              {order.name}
            </Text>
          </View>
          <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{flex: 1}}>
                <Text body2>{t('check_in')}</Text>
              </View>
              <TouchableOpacity style={{flex: 1, alignItems: 'flex-end'}}
              onPress={showDatePicker}>
                <Text body2 semibold>
                  {t('check_in')}
                </Text>
                <Text caption1 grayColor>
                {moment(checkInDate).format('MMMM Do YYYY HH:mm:ss')}

                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{flex: 1}}>
                <Text body2>{t('check_out')}</Text>
              </View>
              <TouchableOpacity style={{flex: 1, alignItems: 'flex-end'}}
              onPress={showDatePicker_}>
                <Text body2 semibold>
                  {t('check_out')}
                </Text>
                <Text caption1 grayColor>
                {moment(checkOutDate).format('MMMM Do YYYY HH:mm:ss')}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
          isVisible={isDatePickerVisible_}
          mode="datetime"
          onConfirm={handleConfirm_}
          onCancel={hideDatePicker_}
        />
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{flex: 1}}>
                <Text body2>{t('duration')}</Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text body2 semibold>
                  1 {t('night')}
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
            <Text body2 style={{marginBottom: 10}}>
              {t('room')}
            </Text>
            <Text body1 semibold style={{marginBottom: 5}}>
              {order.sub_name} (x1)
            </Text>
            {/* <Text body2 style={{marginBottom: 5}}>
              Other hygienic practices that the new hotel, among other guests
            </Text>
            <Text body2 style={{marginBottom: 5}}>
              Other hygienic practices that the new hotel, among other guests
            </Text> */}
            <Text body2 style={{marginBottom: 5}}>
              Other hygienic practices that the new hotel, among other guests
            </Text>
          </View>
          {/* <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
            <Text body2 style={{marginBottom: 10}}>
              Contact’s Details
            </Text>
            <Text body1 semibold style={{marginBottom: 5}}>
              Standard Twin Room (x1)
            </Text>
            <Text body2 grayColor style={{marginBottom: 5}}>
              Other hygienic practices that the new hotel — which handles, among
              other guests, patients seeking medical treatment at the Texas
              Medical Center — include removing nonessential items like
              decorative pillows and magazines
            </Text>
          </View> */}
          <View style={{paddingVertical: 10}}>
            <Text body2 style={{marginBottom: 10}}>
              Price Details
            </Text>
            <Text body1 semibold style={{marginBottom: 5}}>
              {'\u20a6'} {order.price}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View
        style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
        <View>
          <Text caption1 semibold grayColor>
            {no_of_days} {t('day')} / 1 {t('night')}
          </Text>
          <Text title3 primaryColor semibold>
            {'\u20a6'}{order.price}
          </Text>
          <Text caption1 semibold grayColor style={{marginTop: 5}}>
            {adultNo} {t('adults')} / {childrenNo} {t('children')}
          </Text>
        </View>
        <Button onPress={() => book()}>
          {t('continue')}
        </Button>
      </View>
    </SafeAreaView>
  );
}
const mapStateToProps = (state) => ({
  order: state.order,
});
export default connect(mapStateToProps)(PreviewBooking);
