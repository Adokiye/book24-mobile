import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform, ScrollView, StyleSheet} from 'react-native';
import {BaseStyle, BaseColor, useTheme, BASE_URL, } from '@config';
import {Header, SafeAreaView, TextInput, Icon, Text, Button} from '@components';
import RNPaystack from 'react-native-paystack';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import AsyncStorage from '@react-native-community/async-storage';
import { connect, useDispatch } from "react-redux";


const CheckOut = ({route, navigation,order})=> {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postCode, setPostCode] = useState('');
  const [country, setCountry] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('')
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [valid, setvalid] = useState('');
  const [cvv, setCvv] = useState('');
  const [success] = useState({
    street: true,
    city: true,
    postCode: true,
    country: true,
    contactName: true,
    email: true,
    phone: true,
  });

  /**
   *
   * Called when process checkout
   */
  const onCheckOut = () => {
    const bookingType = route.params?.bookingType;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      switch (bookingType) {
        case 'Event':
          navigation.navigate('EventTicket');
          break;
        case 'Bus':
          navigation.navigate('BusTicket');
          break;
        default:
          navigation.navigate('PaymentMethod');
          break;
      }
    }, 500);
  };

  const handleInput = (type, text) => {
    if (type === 1) {
      setError({...error, cardNumber: null});
      setCardNumber(text);
    } else if (type === 2) {
      setError({...error, valid: null});
      let textTemp = text;
      // if (textTemp[0] !== '1' && textTemp[0] !== '0') {
      //   textTemp = '';
      // }
      if (textTemp.length === 2) {
        if(valid.indexOf('/') == -1){
          textTemp = textTemp +'/';
        }
      }
      setvalid(textTemp);
    } else if (type === 3) {
      setError({...error, cvv: null});
      setCvv(text);
    }
  };

  const submit = (inputType) => {
    //console.log(signUp.firstName);
    switch (inputType) {
      case 1:
        if (cardNumber === '') {
          setError({...error, cardNumber: 'Card Number field is required'});
        }
        break;
      case 2:
        if (valid === '') {
          setError({...error, valid: 'Month and Year field is required'});
        } else if (valid.length < 5) {
          setError({...error, cardNumber: 'Month and Year field is invalid'});
        }
        break;
      case 3:
        if (cvv === '') {
          setError({...error, valid: 'Cvv field is required'});
        }
        break;
      default:
        return null;
    }
  };

  const addCard = () => {
    let data = order.data
    setLoading(true);
    RNPaystack.chargeCard({
      cardNumber,
      expiryMonth: valid.substring(0, 2),
      expiryYear: valid.substring(3, 5),
      cvv,
      email: 'cynthiakosuji@gmail.com',
      amountInKobo: order.price, //50 naira in kobo to charge the card
    })
      .then(async(response) => {
        let reference = response.reference
        setLoading(true);
        console.log(reference);
        data.payment_reference = reference;
        data.paid = true;
        let token = await AsyncStorage.getItem("token");
        var configHeader = {
          headers: { Authorization: "Bearer " + token },
          timeout: 20000,
        };
        axios
          .post(BASE_URL + url, data, configHeader)
          .then((response) => {
            console.log(response);
            return navigation.navigate('Home');

          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => setLoader(false));
      })
      .catch((errorPaystack) => {
        setIsLoading(false);
        console.log(errorPaystack); // errorPaystack is a javascript Error object
        console.log(errorPaystack.message);
        console.log(errorPaystack.code);
      //  Toast.show(errorPaystack.message);
      });
    //  .finally(() => setIsLoading(false));
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('check_out')}
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
        renderRight={() => {
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('reset')}
            </Text>
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {}}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={{paddingHorizontal: 20}}>
          <Text headline semibold style={{marginTop: 20}}>
            {t('billing_information')}
          </Text>
          <TextInput
        label="Card Number"
        value={cardNumber}
        onChangeText={(input) => handleInput(1, input)}
        onSubmitEditing={() => submit(1)}
        placeholder="0000 0000 0000 0000"
        keyboardType={'numeric'}
      />
      <View style={classes.inlineInputs}>
      <View style={{width:'48%'}}>
        <TextInput
          label="Valid Till"
          value={valid}
          onChangeText={(input) => handleInput(2, input)}
          onSubmitEditing={() => submit(2)}
          placeholder="MM/YY"
          keyboardType={'numeric'}
        /></View>
        <View></View>
      <View style={{width:'48%'}}>

        <TextInput
          label="Cvv"
          value={cvv}
          onChangeText={(input) => handleInput(3, input)}
          onSubmitEditing={() => submit(3)}
          placeholder="123"
          keyboardType={'numeric'}
        /></View>
      </View>
        </ScrollView>
        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <Button
            loading={loading}
            full
            onPress={() => {
              addCard();
            }}>
            {t('check_out')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const mapStateToProps = (state) => ({
  order: state.order,
});
export default connect(mapStateToProps)(CheckOut);
const classes = StyleSheet.create({
  root: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 10,
  },
  rootBtn: {
    marginTop: 'auto',
    marginBottom: 40,
  },

  inlineInputs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,

  },
  rootText: {
    fontSize: 14,
    color: '#1281dd',
    marginBottom: 30,
  },
});
