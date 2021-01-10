import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text} from '@components';
import RangeSlider from 'rn-range-slider';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import styles from './styles';

export default function EventFilter({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [priceBegin, setPriceBegin] = useState(0);
  const [priceEnd, setPriceEnd] = useState(1000);
  const [category, setCategory] = useState([
    {id: '1', selected: true, title: 'All'},
    {id: '2', selected: false, title: 'Music'},
    {id: '3', selected: false, title: 'Sport'},
    {id: '4', selected: false, title: 'Shows'},
    {id: '5', selected: false, title: 'Events'},
    {id: '6', selected: false, title: 'Discount'},
  ]);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  /**
   * on Select category
   * @param {*} selected
   */
  const onSelectCategory = selected => {
    setCategory(
      category.map(item => {
        return {
          ...item,
          selected: selected.id == item.id ? !item.selected : item.selected,
        };
      }),
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('filtering')}
        renderLeft={() => {
          return <Icon name="times" size={20} color={colors.primary} />;
        }}
        renderRight={() => {
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('apply')}
            </Text>
          );
        }}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => navigation.goBack()}
      />
      <ScrollView
        scrollEnabled={scrollEnabled}
        onContentSizeChange={(contentWidth, contentHeight) =>
          setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
        }>
        <View style={{padding: 20}}>
          <Text headline semibold>
            {t('Price').toUpperCase()}
          </Text>
          <View style={styles.contentRange}>
            <Text caption1 grayColor>
              $100
            </Text>
            <Text caption1 grayColor>
              $1000
            </Text>
          </View>
          <RangeSlider
            style={{
              width: '100%',
              height: 40,
            }}
            thumbRadius={12}
            lineWidth={5}
            gravity={'center'}
            labelStyle="none"
            min={100}
            max={1000}
            step={1}
            selectionColor={colors.primary}
            blankColor={BaseColor.dividerColor}
            onValueChanged={(low, high, fromUser) => {
              setPriceBegin(low);
              setPriceEnd(high);
            }}
            onTouchStart={() => {
              setScrollEnabled(false);
            }}
            onTouchEnd={() => {
              setScrollEnabled(true);
            }}
          />
          <View style={styles.contentResultRange}>
            <Text caption1>{t('avg_price')}</Text>
            <Text caption1>
              ${priceBegin} - ${priceEnd}
            </Text>
          </View>
          <Text headline semibold style={{marginVertical: 20}}>
            {t('category').toUpperCase()}
          </Text>
          {category.map((item, index) => {
            return (
              <TouchableOpacity
                key={index.toString()}
                style={styles.lineCategory}
                onPress={() => onSelectCategory(item)}>
                <Icon
                  name={item.selected ? 'check-circle' : 'circle'}
                  size={24}
                  color={colors.primary}
                />
                <Text body1 style={{marginLeft: 10}}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
