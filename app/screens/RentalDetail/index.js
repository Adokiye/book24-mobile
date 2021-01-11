import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {BaseColor, Images, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  PostListItem,
  HelpBlock,
  Button,
  RoomType,
  HotelItem,
  EventCard,
} from '@components';
import * as Utils from '@utils';
import {InteractionManager} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {connect, useDispatch} from 'react-redux';
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
  setOrderType,
} from '../../actions/order';
import styles from './styles';
import {HelpBlockData} from '@data';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

export default function RentalDetail({navigation, route}) {
  const dispatch = useDispatch();
  const {item, rentals} = route.params;
  const {colors} = useTheme();
  const {t} = useTranslation();
  console.log('----');
  console.log(item);
  console.log('----');
  const {features, bio} = item;
  const rentalData = item;

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [renderMapView, setRenderMapView] = useState(false);
  const [region] = useState({
    latitude: 1.9344,
    longitude: 103.358727,
    latitudeDelta: 0.05,
    longitudeDelta: 0.004,
  });
  const [helpBlock] = useState(HelpBlockData);
  const deltaY = new Animated.Value(0);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setRenderMapView(true);
    });
  }, []);

  const book = async () => {
    const new_data = {
      rental_id: item.id,
      price: parseInt(item.ticket_type[0].price),
    };
    dispatch(setOrderData(new_data));
    dispatch(setOrderUrl('rentalBooking'));
    dispatch(setOrderPrice(parseInt(item.price)));
    dispatch(setOrderType('rental'));

    dispatch(
      setOrderImage(
        rentalData.images && rentalData.images[0] && rentalData.images[0].url,
      ),
    );
    // this.props.setOrderCheckInDate(moment(book_in_date).format('MMMM DDDD YYYY HH:mm:ss'))
    // this.props.setOrderCheckOutDate(moment(book_out_date).format('MMMM DDDD YYYY HH:mm:ss'))
    dispatch(setOrderName(rentalData.name));
    // this.props.setOrderSubData(
    //   {
    //     'No of adults':no_of_adults,
    //     'No of children': no_of_children,
    //   }
    // )
    //dispatch(setOrderSubName(item.name));
    return navigation.navigate('PreviewBooking');
  };

  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;

  const average_price = item.price
  console.log(item.images[0].url);
  return (
    <View style={{flex: 1}}>
      <Animated.Image
        source={{uri: item.images[0].url}}
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(200),
                Utils.scaleWithPixel(200),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}
      />
      <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
        {/* Header */}
        <Header
          title=""
          renderLeft={() => {
            return (
              <Icon
                name="arrow-left"
                size={20}
                color={BaseColor.whiteColor}
                enableRTL={true}
              />
            );
          }}
          renderRight={() => {
            return (
              <Icon name="images" size={20} color={BaseColor.whiteColor} />
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
          onPressRight={() => {
            navigation.navigate('PreviewImage', {item});
          }}
        />
        <ScrollView
          onScroll={Animated.rental([
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ])}
          onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
          scrollEventThrottle={8}>
          {/* Main Container */}
          <View style={{paddingHorizontal: 20}}>
            {/* Information */}
            <View
              style={[
                styles.contentBoxTop,
                {
                  marginTop: marginTopBanner,
                  backgroundColor: colors.card,
                  shadowColor: colors.border,
                  borderColor: colors.border,
                },
              ]}>
              <Text title2 semibold style={{marginBottom: 5}}>
                {item.name}
              </Text>
              <StarRating
                disabled={true}
                starSize={14}
                maxStars={5}
                rating={4.5}
                selectedStar={(rating) => {}}
                fullStarColor={BaseColor.yellowColor}
              />
              <Text
                body2
                numberOfLines={3}
                style={{
                  marginTop: 5,
                  textAlign: 'center',
                }}>
                {item.description}
              </Text>
            </View>
            {/* Rating Review */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={[
                    styles.circlePoint,
                    {backgroundColor: colors.primary},
                  ]}>
                  <Text title3 whiteColor>
                    9.5
                  </Text>
                </View>
                <View>
                  <Text title3 primaryColor style={{marginBottom: 3}}>
                    {t('excellent')}
                  </Text>
                  <Text body2>See 801 reviews</Text>
                </View>
              </View>
              <View style={styles.contentRateDetail}>
                <View style={[styles.contentLineRate, {marginRight: 10}]}>
                  <View style={{flex: 1}}>
                    <Text caption2 grayColor style={{marginBottom: 5}}>
                      Interior Design
                    </Text>
                    <View style={styles.lineBaseRate} />
                    <View
                      style={[
                        styles.linePercent,
                        {backgroundColor: colors.accent},
                        {width: '40%'},
                      ]}
                    />
                  </View>
                  <Text caption2 style={{marginLeft: 15}}>
                    4
                  </Text>
                </View>
                <View style={styles.contentLineRate}>
                  <View style={{flex: 1}}>
                    <Text caption2 grayColor style={{marginBottom: 5}}>
                      Server Quality
                    </Text>
                    <View style={styles.lineBaseRate} />
                    <View
                      style={[
                        styles.linePercent,
                        {backgroundColor: colors.accent},
                        {width: '70%'},
                      ]}
                    />
                  </View>
                  <Text caption2 style={{marginLeft: 15}}>
                    7
                  </Text>
                </View>
              </View>
              <View style={styles.contentRateDetail}>
                <View style={[styles.contentLineRate, {marginRight: 10}]}>
                  <View style={{flex: 1}}>
                    <Text caption2 grayColor style={{marginBottom: 5}}>
                      Interio Design
                    </Text>
                    <View style={styles.lineBaseRate} />
                    <View
                      style={[
                        styles.linePercent,
                        {backgroundColor: colors.accent},
                        {width: '50%'},
                      ]}
                    />
                  </View>
                  <Text caption2 style={{marginLeft: 15}}>
                    5
                  </Text>
                </View>
                <View style={styles.contentLineRate}>
                  <View style={{flex: 1}}>
                    <Text caption2 grayColor style={{marginBottom: 5}}>
                      Server Quality
                    </Text>
                    <View style={styles.lineBaseRate} />
                    <View
                      style={[
                        styles.linePercent,
                        {backgroundColor: colors.accent},
                        {width: '60%'},
                      ]}
                    />
                  </View>
                  <Text caption2 style={{marginLeft: 15}}>
                    6
                  </Text>
                </View>
              </View>
            </View>
            {/* Description */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold>
                {item.description}
              </Text>
              <Text body2 style={{marginTop: 5}}>
                {item.address}
              </Text>
            </View>
            {/* Map location */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline style={{marginBottom: 5}} semibold>
                {item.location.substring(0, 1).toUpperCase() +
                  item.location.substring(1, item.location.length)}
              </Text>
              <Text body2 numberOfLines={2}>
                {item.address}
              </Text>
              {/* <View
                style={{
                  height: 180,
                  width: '100%',
                  marginTop: 10,
                }}>
                {renderMapView && (
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={region}
                    onRegionChange={() => {}}>
                    <Marker
                      coordinate={{
                        latitude: 1.9344,
                        longitude: 103.358727,
                      }}
                    />
                  </MapView>
                )}
              </View> */}
            </View>
            {/* Open Time */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold>
                {t('good_to_know')}
              </Text>
              {/* <View
                style={{
                  flexDirection: 'row',
                  marginTop: 5,
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Text body2 grayColor>
                    {'Start Date'}
                  </Text>
                  <Text body2 accentColor semibold>
                    {moment(item.start_date).format('DD MMM Do YYYY')}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Text body2 grayColor>
                    {'End Date'}
                  </Text>
                  <Text body2 accentColor semibold>
                    {moment(item.end_date).format('DD MMM Do YYYY')}
                  </Text>
                </View>
              </View> */}
            </View>
            {/* Activities */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  alignItems: 'flex-end',
                }}>
                <Text headline semibold>
                  {'You might also like'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Rental');
                  }}>
                  <Text caption1 grayColor>
                    {t('show_more')}
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={rentals}
                keyExtractor={(item, index) => item.id}
                renderItem={({item, index}) => {
                  if (index < 4) {
                    return (
                      <HotelItem
                        grid={true}
                        image={item.images[0].url}
                        name={item.name}
                        location={
                          item.location.substring(0, 1).toUpperCase() +
                          item.location.substring(1, item.location.length) +
                          ',Nigeria'
                        }
                        price={''}
                        available={item.available}
                        rate={item.rate}
                        rateStatus={item.rateStatus}
                        numReviews={item.numReviews}
                        services={item.features}
                        style={{marginLeft: 15, width: 150, marginBottom: 15}}
                        onPress={() =>
                          navigation.navigate('RentalDetail', {item})
                        }
                      />
                    );
                  }
                }}
              />
            </View>
            {/* Help Block Information */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <HelpBlock
                title={helpBlock.title}
                description={helpBlock.description}
                phone={item.contact_phone || item.contact_website}
                email={item.contact_email}
                style={{margin: 20}}
                onPress={() => {
                  navigation.navigate('ContactUs');
                }}
              />
            </View>
          </View>
        </ScrollView>
        {/* Pricing & Booking Process */}
        <View
          style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
          <View>
            <Text caption1 semibold>
              {t('price')}
            </Text>
            <Text title3 primaryColor semibold>
              {'\u20a6'}
              {average_price}
            </Text>
            <Text caption1 semibold style={{marginTop: 5}}>
              {item.name}
            </Text>
          </View>
          <Button onPress={() => book()}>{t('book_now')}</Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
