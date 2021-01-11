import React, {useState} from 'react';
import {View, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import {BaseStyle, BaseColor, Images, useTheme} from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  ProfileDetail,
  ProfilePerformance,
  Tag,
  PostListItem,
  Button,
} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {UserData} from '@data';
import AsyncStorage from '@react-native-community/async-storage';
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
} from '../../actions/order';

export default function HotelInformation({navigation, route}) {
  const {params} = route;
  const {item, features, bio, hotelData} = params;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [userData] = useState(UserData[0]);
  const [service] = useState([
    {id: '1', name: 'wifi'},
    {id: '2', name: 'coffee'},
    {id: '3', name: 'bath'},
    {id: '4', name: 'car'},
    {id: '5', name: 'paw'},
    {id: '6', name: 'futbol'},
    {id: '7', name: 'user-secret'},
    {id: '8', name: 'clock'},
    {id: '9', name: 'tv'},
    {id: '10', name: 'futbol'},
  ]);

  const book = async () => {
    let token = (await AsyncStorage.getItem('token')) ?? '';
    if (token == null || token == '') {
      return navigation.navigate('Walkthrough');
    } else {
      const new_data = {
        room_type_id: item.id,
        price: parseInt(item.price),
        // check_in_date: book_in_date,
        // check_out_date: book_out_date,
        hotel_id: parseInt(item.id),
        // no_of_adults: no_of_adults,
        // no_of_children: no_of_children,
      };
      dispatch(setOrderData(new_data));
      dispatch(setOrderUrl('hotelBooking'));
      dispatch(setOrderPrice(parseInt(item.price)));
      dispatch(
        setOrderImage(item.images && item.images[0] && item.images[0].url),
      );
      // this.props.setOrderCheckInDate(moment(book_in_date).format('MMMM DDDD YYYY HH:mm:ss'))
      // this.props.setOrderCheckOutDate(moment(book_out_date).format('MMMM DDDD YYYY HH:mm:ss'))
      dispatch(setOrderName(item.name));
      // this.props.setOrderSubData(
      //   {
      //     'No of adults':no_of_adults,
      //     'No of children': no_of_children,
      //   }
      // )
      //  this.props.setOrderSubName(item.name)
      return navigation.navigate('PreviewBooking');
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={'Room Information'}
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
        {/* Image Gallery */}
        <TouchableOpacity
          style={styles.contentGallery}
          onPress={() => {
            navigation.navigate('PreviewImage');
          }}
          activeOpacity={0.9}>
          <View style={styles.galleryLineTop}>
            {item.images.map((el, index) => (
              <View style={{flex: 1, paddingRight: 5}}>
                <Image
                  source={{uri: el.url}}
                  style={{width: '100%', height: '100%'}}
                />
              </View>
            ))}
            {/* <View style={{flex: 1, paddingRight: 5}}>
              <Image
                source={Images.room1}
                style={{width: '100%', height: '100%'}}
              />
            </View>
            <View style={{flex: 1}}>
              <Image
                source={Images.room2}
                style={{width: '100%', height: '100%'}}
              />
            </View> */}
          </View>
          {/* <View style={styles.galleryLineBottom}>
            <View style={{flex: 1, paddingRight: 5}}>
              <Image
                source={Images.room3}
                style={{width: '100%', height: '100%'}}
              />
            </View>
            <View style={{flex: 1, paddingRight: 5}}>
              <Image
                source={Images.room4}
                style={{width: '100%', height: '100%'}}
              />
            </View>
            <View style={{flex: 1}}>
              <Image
                source={Images.room5}
                style={{width: '100%', height: '100%'}}
              />
              <Text
                headline
                whiteColor
                style={{
                  position: 'absolute',
                  right: 10,
                  bottom: 10,
                }}>
                5+
              </Text>
            </View>
          </View> */}
        </TouchableOpacity>
        {/* Information */}
        <View style={{paddingHorizontal: 20}}>
          <Text title2 semibold style={{marginTop: 10}}>
            {item.name}
          </Text>
          <View
            style={{
              width: 66,
              marginTop: 10,
              marginBottom: 20,
            }}>
            <StarRating
              disabled={true}
              starSize={14}
              maxStars={5}
              rating={4.7}
              selectedStar={(rating) => {}}
              fullStarColor={BaseColor.yellowColor}
            />
          </View>
          {/* Facilities & Icon */}
          <Text headline style={{marginBottom: 10}} semibold>
            {t('facilities_of_hotel')}
          </Text>
          <FlatList
            numColumns={5}
            data={features}
            keyExtractor={(item, index) => item.id}
            renderItem={({item}) => (
              <View
                style={{
                  padding: 10,
                  alignItems: 'center',
                }}>
                <Icon name={'check'} size={24} color={colors.accent} />
                <Text overline grayColor>
                  {item.name}
                </Text>
              </View>
            )}
          />
          {/* Information */}
          <Text headline semibold style={{marginTop: 10}}>
            {t('hotel_description')}
          </Text>
          <Text footnote grayColor style={{marginBottom: 8, marginTop: 3}}>
            {bio}
          </Text>
          {/* <TouchableOpacity style={{alignItems: 'center'}}>
            <Text caption1 accentColor>
              {t('see_details')}
            </Text>
          </TouchableOpacity> */}
        </View>
        <View style={[styles.line, {backgroundColor: colors.border}]} />
        {/* Hosting Profile */}
        {/* <ProfileDetail
          image={userData.image}
          textFirst={userData.name}
          textSecond={userData.address}
          textThird={userData.id}
          point={userData.point}
          style={{paddingHorizontal: 20}}
          onPress={() => navigation.navigate('Profile1')}
        />
        <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
          <ProfilePerformance type="medium" data={userData.performance} />
        </View> */}

        {/* <View style={styles.contentTag}>
          <Tag
            outline
            style={{marginRight: 15}}
            onPress={() => navigation.navigate('Messages')}>
            {t('contact_host')}
          </Tag>
          <Tag primary onPress={() => navigation.navigate('Profile3')}>
            {t('view_profile')}
          </Tag>
        </View> */}
        {/* Activities */}
        <View style={styles.contentTodo}>
          <Text headline semibold>
            {t('todo_things')}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Post')}>
            <Text caption1 grayColor>
              {t('show_more')}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          contentContainerStyle={{
            paddingLeft: 5,
            paddingRight: 20,
            paddingBottom: 20,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={[
            {id: '1', image: Images.trip1},
            {id: '2', image: Images.trip2},
            {id: '3', image: Images.trip3},
            {id: '4', image: Images.trip4},
            {id: '5', image: Images.trip5},
          ]}
          keyExtractor={(item, index) => item.id}
          renderItem={({item}) => (
            <PostListItem
              image={item.image}
              style={{marginLeft: 15}}
              title="South Travon"
              description="Andaz Tokyo Toranomon Hills is one of the newest luxury hotels in Tokyo. Located in one of the uprising areas of Tokyo"
              date="6 Deals Left"
              onPress={() => navigation.navigate('PostDetail')}
            />
          )}
        />
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
            {item.price}
          </Text>
          <Text caption1 semibold style={{marginTop: 5}}>
            {t('avg_night')}
          </Text>
        </View>
        <Button onPress={() => book()}>{t('book_now')}</Button>
      </View>
    </SafeAreaView>
  );
}
