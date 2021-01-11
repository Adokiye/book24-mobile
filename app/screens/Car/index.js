import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl, View, Animated} from 'react-native';
import {BaseStyle, useTheme, BASE_URL} from '@config';
import {useTranslation} from 'react-i18next';
import {Header, SafeAreaView, Icon, CarItem, FilterSort} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {CarData} from '@data';
import axios from 'axios';

export default function Car({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const [load, setLoad] = useState(false);
  const [error,setError] = useState('')
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

  const [refreshing] = useState(false);
  const [modeView, setModeView] = useState('grid');
  const [cars, setCars] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoad(true)
    await axios
      .get(BASE_URL + 'cars')
      .then(async (res) => {
        // console.log(res.data.rows)
        setCars(res.data.rows);
      })
      .catch((err) => {
        console.log(err);
       setError(err.message);
        //    setLoad(true)
      }).finally(()=>setLoad(false));
  };

  /**
   * Called when onChange sort
   */
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
              data={cars}
              key={'block'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <CarItem
                  block
                  image={
                    item.images != null && item.images.length > 0
                      ? item.images[0].url
                      : ''
                  }
                  title={item.name}
                  name={item.description}
                  price={
                        '\u20a6' +
                        parseInt(item.price)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                  per={item.per}
                  rate={item.rate}
                  numReviews={item.numReviews}
                  services={item.services}
                  style={{
                    marginBottom: 15,
                    marginLeft: 15,
                  }}
                  onPress={() => {
                    navigation.navigate('CarDetail', {item});
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
              numColumns={2}
              data={cars}
              key={'grid'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <CarItem
                  grid
                  image={
                    item.images != null && item.images.length > 0
                      ? item.images[0].url
                      : ''
                  }
                  title={item.title || item.description}
                  name={item.name}
                  price={
                        '\u20a6' +
                        parseInt(item.price)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                  per={item.per}
                  rate={item.rate}
                  numReviews={item.numReviews}
                  services={item.services}
                  style={{
                    marginBottom: 15,
                    marginLeft: 15,
                  }}
                  onPress={() => {
                    navigation.navigate('CarDetail', {item});
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
              data={cars}
              key={'list'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <CarItem
                  list
                  image={
                    item.images != null && item.images.length > 0
                      ? item.images[0].url
                      : ''
                  }
                  title={item.title || item.description}
                  name={item.name}
                  price={
                        '\u20a6' +
                        parseInt(item.price)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                  per={item.per}
                  rate={item.rate}
                  numReviews={item.numReviews}
                  services={item.services}
                  style={{
                    marginBottom: 15,
                    marginLeft: 15,
                  }}
                  onPress={() => {
                    navigation.navigate('CarDetail', {item});
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
                paddingBottom: 20,
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
              data={cars}
              key={'block'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <CarItem
                  block
                  image={
                    item.images != null && item.images.length > 0
                      ? item.images[0].url
                      : ''
                  }
                  title={item.title || item.description}
                  name={item.name}
                  price={
                        '\u20a6' +
                        parseInt(item.price)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                  per={item.per}
                  rate={item.rate}
                  numReviews={item.numReviews}
                  services={item.services}
                  style={{
                    marginBottom: 15,
                    marginLeft: 15,
                  }}
                  onPress={() => {
                    navigation.navigate('CarDetail', {item});
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
        title={t('Car')}
        subTitle=""
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
          navigation.navigate('SearchHistory');
        }}
      />
      {renderContent()}
    </SafeAreaView>
  );
}
