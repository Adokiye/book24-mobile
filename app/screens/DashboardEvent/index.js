import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {BaseStyle, BaseColor, Images, useTheme, BASE_URL} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  TextInput,
  EventCard,
  EventItem,
} from '@components';
import {EventListData} from '@data';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import axios from 'axios'

export default function DashboardEvent({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [search, setSearch] = useState('');
  const [loading] = useState(false);
  const [load, setLoad] = useState(false)
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setLoad(true)
    axios.get(BASE_URL+'events')
        .then(res => {
          // console.log(res.data.rows)
            setEvents(res.data.rows);
        })
        .catch(err => {
          console.log(err)
         //   setError(err.message);
        }).finally(()=>setLoad(false))
}, []);

  /**
   * onSearch change
   * @param {*} keyword
   */
  const onSearch = keyword => {};

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('search')}
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
          if (loading) {
            return <ActivityIndicator size="small" color={colors.primary} />;
          }
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <View style={{padding: 20}}>
          <TextInput
            onChangeText={text => setSearch(text)}
            placeholder={t('search')}
            value={search}
            onSubmitEditing={() => {
              onSearch(search);
            }}
            icon={
              <TouchableOpacity
                onPress={() => {
                  setSearch('');
                }}
                style={styles.btnClearSearch}>
                <Icon name="times" size={18} color={BaseColor.grayColor} />
              </TouchableOpacity>
            }
          />
        </View>
        <Text title3 semibold style={{padding: 20}}>
          {'Upcoming Events'}
        </Text>
        <View>
          <FlatList
            contentContainerStyle={{
              paddingRight: 20,
              paddingLeft: 5,
            }}
           // horizontal={true}
            data={events}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item.id}
            renderItem={({item, index}) => (
              <EventCard
                  image={item.images[0].url}
                  title={item.name}
                  time={item.start_date}
                  location={item.location}
                  onPress={() => navigation.navigate('EventDetail',{item})}
                  style={{marginLeft: 15,width:'45%',marginBottom:10}}
                />
            )}
          />
        </View>
        {/* <Text title3 semibold style={{padding: 20}}>
          {t('recommend_for_you')}
        </Text>
        <FlatList
          contentContainerStyle={{
            paddingRight: 20,
            paddingLeft: 5,
            paddingBottom: 20,
          }}
          horizontal={true}
          data={events}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item.id}
          renderItem={({item, index}) => (
            <EventItem
              grid
              image={item.images[0].url}
              title={item.name}
              subtitle={item.subtitle}
              location={item.location}
              tracking={item.tracking}
              rate={item.rate}
              status={item.status}
              price={item.price}
              priceSale={item.priceSale}
              eventType={item.eventType}
              time={item.time}
              user={item.user}
              numTicket={item.numTicket}
              liked={item.liked}
              style={{marginLeft: 15, width: 200}}
              onPress={() => navigation.navigate('EventDetail',item)}
              onPressTag={() => navigation.navigate('Review')}
            />
          )}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
}
