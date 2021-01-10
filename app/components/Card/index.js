import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import {Image} from '@components';
import {Images, useTheme} from '@config';

export default function Card(props) {
  const {colors} = useTheme();
  const {style, children, styleContent, image, onPress,uri} = props;
  function isInt(value) {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
  }
  console.log(image)
  return (
    <TouchableOpacity
      style={[styles.card, {borderColor: colors.border}, style]}
      onPress={onPress}
      activeOpacity={0.9}>
   {  !isInt(image) && uri == null && <Image source={{uri:image}} style={styles.imageBanner} />}
   {uri != null && !uri && <Image source={image} style={styles.imageBanner} />}
      <View style={[styles.content, styleContent]}>{children}</View>
    </TouchableOpacity>
  );
}

Card.propTypes = {
  image: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleContent: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  onPress: PropTypes.func,
};

Card.defaultProps = {
  image: Images.profile2,
  style: {},
  styleContent: {},
  onPress: () => {},
};
