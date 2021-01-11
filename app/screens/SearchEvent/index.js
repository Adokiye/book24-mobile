import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  RefreshControl,
} from 'react-native';
import {BaseStyle, BaseColor, useTheme, BASE_URL} from '../SearchTour/node_modules/@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  BookingTime,
  TextInput,
  FilterSort,
  HotelItem,
} from '../SearchTour/node_modules/@components';
import Modal from 'react-native-modal';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import axios from 'axios';

export default function SearchEvent({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [keyword, setKeyword] = useState('');
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(1);
  const [night, setNight] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [searchedEvents, setSearchedEvents] = useState([]);
  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
      }),
      offsetAnim,
    ),
    0,
    40,
  );
  const navbarTranslate = clampedScroll.interpolate({
    inputRange: [0, 40],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(BASE_URL + 'events')
      .then(async (res) => {
        // console.log(res.data.rows)
        setEvents(res.data.rows);
      })
      .catch((err) => {
        console.log(err);
        //   setError(err.message);
        //    setLoad(true)
      });
  };

  const filterByValue = (array, string) => {
    if (string != '') {
      return array.filter((o) =>
        o['name'].toLowerCase().includes(string.toLowerCase()),
      );
    } else {
      return [];
    }
  };

  /**
   * call when action modal
   * @param {*} modal
   */
  const openModal = (modal) => {
    setModalVisible(modal);
  };

  /**
   * call when on change value
   * @param {*} mode
   * @param {*} value
   */
  const setValue = (mode, value) => {
    switch (value) {
      case 'adult':
        if (mode == 'up') {
          setAdult(adult + 1);
        } else {
          setAdult(adult - 1 > 0 ? adult - 1 : 0);
        }
        break;
      case 'children':
        if (mode == 'up') {
          setChildren(children + 1);
        } else {
          setChildren(children - 1 > 0 ? children - 1 : 0);
        }
        break;
      case 'night':
        if (mode == 'up') {
          setNight(night + 1);
        } else {
          setNight(night - 1 > 0 ? night - 1 : 0);
        }
        break;
    }
  };

  /**
   * render UI modal
   * @returns
   */
  const renderModal = () => {
    return (
      <View>
        <Modal
          isVisible={modalVisible === 'quest'}
          onSwipeComplete={() => setModalVisible(false)}
          swipeDirection={['down']}
          style={styles.bottomModal}>
          <View
            style={[
              styles.contentFilterBottom,
              {backgroundColor: colors.card},
            ]}>
            <View style={styles.contentSwipeDown}>
              <View style={styles.lineSwipeDown} />
            </View>
            <View
              style={[
                styles.contentActionModalBottom,
                {borderBottomColor: colors.border},
              ]}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text body1>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text body1 primaryColor>
                  {t('save')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.lineRow}>
              <View>
                <Text body1>{t('adults')}</Text>
                <Text caption1 grayColor>
                  16+ {t('years')}
                </Text>
              </View>
              <View style={styles.iconRight}>
                <TouchableOpacity onPress={() => setValue('down', 'adult')}>
                  <Icon
                    name="minus-circle"
                    size={24}
                    color={BaseColor.grayColor}
                  />
                </TouchableOpacity>
                <Text title1>{adult}</Text>
                <TouchableOpacity onPress={() => setValue('up', 'adult')}>
                  <Icon name="plus-circle" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.lineRow}>
              <View>
                <Text body1>{t('children')}</Text>
                <Text caption1 grayColor>
                  2-11 {t('years')}
                </Text>
              </View>
              <View style={styles.iconRight}>
                <TouchableOpacity onPress={() => setValue('down', 'children')}>
                  <Icon
                    name="minus-circle"
                    size={24}
                    color={BaseColor.grayColor}
                  />
                </TouchableOpacity>
                <Text title1>{children}</Text>
                <TouchableOpacity onPress={() => setValue('up', 'children')}>
                  <Icon name="plus-circle" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={modalVisible === 'duration'}
          onSwipeComplete={() => setModalVisible(false)}
          swipeDirection={['down']}
          style={styles.bottomModal}>
          <View
            style={[
              styles.contentFilterBottom,
              {backgroundColor: colors.card},
            ]}>
            <View style={styles.contentSwipeDown}>
              <View style={styles.lineSwipeDown} />
            </View>
            <View
              style={[
                styles.contentActionModalBottom,
                {borderBottomColor: colors.border},
              ]}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text body1>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text body1 primaryColor>
                  {t('save')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.lineRow, {marginBottom: 40}]}>
              <View>
                <Text body1>{t('duration')}</Text>
                <Text caption1 grayColor>
                  {t('night')}
                </Text>
              </View>
              <View style={styles.iconRight}>
                <TouchableOpacity onPress={() => setValue('down', 'night')}>
                  <Icon
                    name="minus-circle"
                    size={24}
                    color={BaseColor.grayColor}
                  />
                </TouchableOpacity>
                <Text title1>{night}</Text>
                <TouchableOpacity onPress={() => setValue('up', 'night')}>
                  <Icon name="plus-circle" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      {renderModal()}
      <Header
        title={'Search'}
        renderLeft={() => {
          return <Icon name="times" size={20} color={colors.primary} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={{padding: 20}}>
          <TextInput
            onChangeText={(text) => {
              setKeyword(text);
              setSearchedEvents(filterByValue(events, text));
            }}
            placeholder={t('What are you looking for')}
            value={keyword}
          />
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 10,
              }}
              columnWrapperStyle={{
                paddingLeft: 5,
                paddingRight: 20,
              }}
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              numColumns={2}
              data={searchedEvents}
              //key={'grid'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <HotelItem
                  grid
                  image={item.images[0].url}
                  name={item.name}
                  location={item.address || ''}
                  price={
                    item.ticket_type.length > 0
                      ? '\u20a6' + parseInt(item.ticket_type[0].price)
                      : null
                  }
                  //available={item.available}
                  rate={item.rate}
                  rateStatus={item.rateStatus}
                  numReviews={item.numReviews}
                  services={item.features}
                  hotel_type={item.hotel_type}
                  onPress={() => navigation.navigate('EventDetail', {item})}
                  style={{
                    marginBottom: 15,
                    marginLeft: 15,
                  }}
                />
              )}
            />
          </View>
        </ScrollView>
        {/* <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <Button
            full
            onPress={() => {
              setLoading(true);
              setTimeout(() => {
                navigation.navigate('Hotel');
                setLoading(false);
              }, 500);
            }}
            loading={loading}>
            {t('apply')}
          </Button>
        </View> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
