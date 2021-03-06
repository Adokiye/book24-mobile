import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl, View, Animated} from 'react-native';
import {BaseStyle, useTheme,BASE_URL} from '@config';
import {Header, SafeAreaView, Icon, TourItem, FilterSort} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {TourData} from '@data';
import {useTranslation} from 'react-i18next';
import axios from 'axios'

export default function Tour({navigation}) {
  const {t} = useTranslation();
  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const [load,setLoad] = useState(false)
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
  const {colors} = useTheme();

  const [refreshing] = useState(false);
  const [modeView, setModeView] = useState('grid');
  const [tours,setTours] = useState([]);

  useEffect(()=>{
  getData()
  },[])

  const getData = async()=>{
    setLoad(true)
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
    }).finally(()=>setLoad(false));
  }
  const onChangeSort = () => {};

  /**
   * @description Open modal when filterring mode is applied
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onFilter = () => { 
    navigation.navigate('Filter');
  };

  /**
   * @description Open modal when view mode is pressed
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'block':
        setModeView('grid');

        break;
      case 'grid':
        setModeView('list');
        break;
      case 'list':
        setModeView('block');
        break;
      default:
        setModeView('block');
        break;
    }
  };

  /**
   * @description Render container view
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */
  const renderContent = () => {
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, 40],
      outputRange: [0, -40],
      extrapolate: 'clamp',
    });
    switch (modeView) {
      case 'block':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
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
              data={tours}
              key={'block'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <TourItem
                  block
                  image={item.images!= null&&item.images.length>0?item.images[0].url:''}
                  name={item.name}
                  location={item.location}
                  travelTime={item.location}
                  startTime={item.startTime}
                  price={
                        '\u20a6' +
                        parseInt(item.price)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                  rate={item.rate}
                  rateCount={item.rateCount}
                  numReviews={item.numReviews}
                  author={item.author}
                  services={item.services}
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail',item);
                  }}
                  onPressBookNow={() => {
                    navigation.navigate('PreviewBooking');
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );
      case 'grid':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              columnWrapperStyle={{
                paddingLeft: 5,
                paddingRight: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
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
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={tours}
              key={'gird'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <TourItem
                  grid
                  image={item.images!= null&&item.images.length>0?item.images[0].url:''}

                  name={item.name}
                  location={item.location}
                  travelTime={item.travelTime}
                  startTime={item.startTime}
                  price={
                        '\u20a6' +
                        parseInt(item.price)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }

                  rate={item.rate}
                  rateCount={item.rateCount}
                  numReviews={item.numReviews}
                  author={item.author}
                  services={item.services}
                  style={{
                    marginBottom: 15,
                    marginLeft: 15,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail',item);
                  }}
                  onPressBookNow={() => {
                    navigation.navigate('PreviewBooking');
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );

      case 'list':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
                paddingHorizontal: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
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
              data={tours}
              key={'list'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <TourItem
                  list
                  image={item.images!= null&&item.images.length>0?item.images[0].url:''}

                  name={item.name}
                  location={item.location}
                  travelTime={item.travelTime}
                  startTime={item.startTime}
                  price={
                        '\u20a6' +
                        parseInt(item.price)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }

                  rate={item.rate}
                  rateCount={item.rateCount}
                  numReviews={item.numReviews}
                  author={item.author}
                  services={item.services}
                  style={{
                    marginBottom: 20,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail',{item});
                  }}
                  onPressBookNow={() => {
                    navigation.navigate('PreviewBooking');
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );
      default:
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
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
              data={tours}
              key={'block'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <TourItem
                  block
                  image={item.images!= null&&item.images.length>0?item.images[0].url:''}

                  name={item.name}
                  location={item.location}
                  travelTime={item.travelTime}
                  startTime={item.startTime}
                  price={'\u20a6'+parseInt(item.price).toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  rate={item.rate}
                  rateCount={item.rateCount}
                  numReviews={item.numReviews}
                  author={item.author}
                  services={item.services}
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail',item);
                  }}
                  onPressBookNow={() => {
                    navigation.navigate('PreviewBooking');
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );
        break;
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('Tours')}
        // subTitle="24 Dec 2018, 2 Nights, 1 Room"
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
          return <Icon name="search" size={20} color={colors.primary} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          navigation.navigate('SearchTour');
        }}
      />
      {renderContent()}
    </SafeAreaView>
  );
}

