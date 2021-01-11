import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import axios from 'axios';
import {
  Image,
  Text,
  Icon,
  HotelItem,
  Card,
  Button,
  SafeAreaView,
  EventCard,
} from '@components';
import {BaseStyle, Images, useTheme, BASE_URL} from '@config';
import * as Utils from '@utils';
import styles from './styles';
import {PromotionData} from '@data';
import {useTranslation} from 'react-i18next';

export default function Home({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [icons] = useState([
    {
      icon: 'bed',
      name: 'Hotels',
      route: 'Hotel',
    },
    {
      icon: 'calendar-alt',
      name: 'Event',
      route: 'DashboardEvent',
    },
    {
      icon: 'globe',
      name: 'Tours',
      route: 'Tour',
    },

    {
      icon: 'plane',
      name: 'Flight',
      route: 'FlightSearch',
    },
    {
      icon: 'ship',
      name: 'Cruise',
      route: 'Cruise',
    },
    {
      icon: 'home',
      name: 'Rental',
      route: 'Rental',
    },

    {
      icon: 'car-alt',
      name: 'Car',
      route: 'Car',
    },
    {
      icon: 'forumbee',
      name: 'Activities',
      route: 'Activity',
    },
  ]);
  const [events, setEvents] = useState([]);
  const [promotion] = useState(PromotionData);
  const [tours, setTours] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const deltaY = new Animated.Value(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(BASE_URL + 'hotels')
      .then(async (res) => {
        // console.log(res.data.rows)
        setHotels(res.data.rows);
        await axios
          .get(BASE_URL + 'events')
          .then(async (res) => {
            // console.log(res.data.rows)
            setEvents(res.data.rows);
            await axios
              .get(BASE_URL + 'tours')
              .then((res) => {
                // console.log(res.data.rows)
                setTours(res.data.rows);
                //   setLoad(true);
              })
              .catch((err) => {
                console.log(err);
                //   setError(err.message);
                //    setLoad(true)
              });
            //   setLoad(true);
          })
          .catch((err) => {
            console.log(err);
            //   setError(err.message);
            //    setLoad(true)
          });
        //   setLoad(true);
      })
      .catch((err) => {
        console.log(err);
        //   setError(err.message);
        //    setLoad(true)
      });
  };

  /**
   * @description Show icon services on form searching
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */
  const renderIconService = () => {
    return (
      <FlatList
        data={icons}
        numColumns={4}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={styles.itemService}
              activeOpacity={0.9}
              onPress={() => {
                navigation.navigate(item.route);
              }}>
              <View
                style={[styles.iconContent, {backgroundColor: colors.card}]}>
                <Icon name={item.icon} size={18} color={colors.primary} solid />
              </View>
              <Text footnote grayColor numberOfLines={1}>
                {t(item.name)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const heightImageBanner = Utils.scaleWithPixel(140);
  const marginTopBanner = heightImageBanner - heightHeader;

  return (
    <View style={{flex: 1}}>
      {/* <Animated.Image
        source={Images.trip3}
        style={[
          styles.imageBackground,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(100),
                Utils.scaleWithPixel(100),
              ],
              outputRange: [heightImageBanner, heightHeader, 0],
            }),
          },
        ]}
      /> */}
      <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
        <View
          style={{
            width: '100%',
            backgroundColor: '#fff',
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            elevation: 3,
          }}>
          <Image
            source={Images.logoBlue}
            style={{
              width: 30,
              height: 30,
              resizeMethod: 'contain',
              marginRight: 10,
            }}
          />
          <Text title3 semibold style={{fontSize: 15}}>
            Book24
          </Text>
        </View>
        <ScrollView
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ])}
          onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
          scrollEventThrottle={8}>
          <View style={{paddingHorizontal: 20}}>
            <View
              style={[
                styles.searchForm,
                {
                  // marginTop: 10,
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  //   shadowColor: colors.border,
                },
              ]}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                activeOpacity={0.9}>
                <View
                  style={[BaseStyle.textInput, {backgroundColor: colors.card}]}>
                  <Text body1 grayColor>
                    {'Search'}
                  </Text>
                </View>
              </TouchableOpacity>
              {renderIconService()}
            </View>
          </View>
          {/* Hiking */}
          <View style={styles.titleView}>
            <Text title3 semibold>
              Today's Deals
            </Text>
            <Text body2 grayColor>
              A compiled list of discounted Hotels in Nigeria
            </Text>
          </View>
          <FlatList
            contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={hotels}
            keyExtractor={(item, index) => item.id}
            renderItem={({item, index}) => {
              if (item.featured) {
                return (
                  <View style={{flexDirection: 'column'}}>
                    <View
                      style={{
                        backgroundColor: '#00A651',
                        paddingVertical: 5,
                        paddingHorizontal: 5,
                        width: 70,
                        left: 10,
                        top: 28,
                        zIndex: 2,
                      }}>
                      <Text style={{color: 'white', fontSize: 14}}>
                        {parseInt(item.rooms[0].discount_rate) + '% off'}
                      </Text>
                    </View>

                    <HotelItem
                      grid={true}
                      image={item.images[0].url}
                      name={item.name}
                      location={
                        item.location.substring(0, 1).toUpperCase() +
                        item.location.substring(1, item.location.length) +
                        ',Nigeria'
                      }
                      price={
                        '\u20a6' +
                        parseInt(item.rooms[0].price)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      available={item.available}
                      rate={item.rate}
                      rateStatus={item.rateStatus}
                      numReviews={item.numReviews}
                      services={item.features}
                      style={{marginLeft: 15, width: 150, marginBottom: 30}}
                      onPress={() => navigation.navigate('HotelDetail', {item})}
                    />
                  </View>
                );
              }
            }}
          />
          <View style={[styles.titleView, {marginTop: -10}]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text title3 semibold>
                {'Hot Events'}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('DashboardEvent')}>
                <Text body2 grayColor>
                  view all
                </Text>
              </TouchableOpacity>
            </View>
            <Text body2 grayColor>
              Buy Tickets to top events around you
            </Text>
          </View>

          <View>
            <FlatList
              contentContainerStyle={{
                paddingRight: 20,
                paddingLeft: 5,
              }}
              horizontal={true}
              data={events}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <EventCard
                  image={item.images[0].url}
                  title={item.name}
                  time={item.start_date}
                  location={item.location}
                  onPress={() => navigation.navigate('EventDetail', {item})}
                  style={{marginLeft: 15, width: 150}}
                />
              )}
            />
          </View>

          <View style={styles.titleView}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text title3 semibold>
                {'Tours'}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Tour')}>
                <Text body2 grayColor>
                  view all
                </Text>
              </TouchableOpacity>
            </View>
            <Text body2 grayColor>
              Explore Nigeria, book a tour today!
            </Text>
          </View>
          <FlatList
            contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={tours}
            keyExtractor={(item, index) => item.id}
            renderItem={({item, index}) => (
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
                onPress={() => navigation.navigate('TourDetail', {item})}
              />
            )}
          />
          {/* <View>
            <Text title3 semibold style={styles.titleView}>
              Popular Cities
            </Text>
            <FlatList
              contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={promotion}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <Card
                  style={[styles.promotionItem, {marginLeft: 15}]}
                  image={item.image}
                  uri={false}
                  onPress={() => navigation.navigate('HotelDetail')}>
                  <Text subhead whiteColor>
                    {item.title1}
                  </Text>
                  <Text title2 whiteColor semibold>
                    {item.title2}
                  </Text>
                  <View style={styles.contentCartPromotion}>
                    <Button
                      style={styles.btnPromotion}
                      onPress={() => {
                        navigation.navigate('PreviewBooking');
                      }}>
                      <Text body2 semibold whiteColor>
                        {t('book_now')}
                      </Text>
                    </Button>
                  </View>
                </Card>
              )}
            />
          </View> */}

          {/* Promotion */}
          <View style={styles.titleView}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text title3 semibold>
                {'All Hotels'}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Hotel')}>
                <Text body2 grayColor>
                  view all
                </Text>
              </TouchableOpacity>
            </View>
            <Text body2 grayColor>
              {/* {t('let_find_promotion')} */}
            </Text>
            {/* <Image source={Images.banner1} style={styles.promotionBanner} />
            <View style={[styles.line, {backgroundColor: colors.border}]} /> */}
          </View>
          <FlatList
            columnWrapperStyle={{paddingLeft: 5, paddingRight: 20}}
            numColumns={2}
            data={hotels}
            keyExtractor={(item, index) => item.id}
            renderItem={({item, index}) => (
              <HotelItem
                grid={true}
                image={item.images[0].url}
                name={item.name}
                location={item.address}
                price={
                  '\u20a6' +
                    parseInt(item.rooms[0].price)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') || ''
                }
                available={item.available}
                rate={item.rate}
                rateStatus={item.rateStatus}
                numReviews={item.numReviews}
                services={item.features}
                style={{marginLeft: 15, marginBottom: 15}}
                onPress={() => navigation.navigate('HotelDetail', {item})}
              />
            )}
          />
          <View style={[styles.titleView, {marginTop: -20}]}>
            <Image source={Images.banner1} style={styles.promotionBanner} />
            <View style={[styles.line, {backgroundColor: colors.border}]} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
