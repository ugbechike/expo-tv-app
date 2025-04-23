// import { Image, Pressable, StyleSheet, Text } from 'react-native';

import { Image, Pressable, StyleSheet, Text, TVFocusGuideView } from 'react-native';

export const MovieCard = ({
  title,
  posterUri,
  onFocus,
}: {
  title: string;
  posterUri: string;
  onFocus?: () => void;
}) => {
  
  return (
    <TVFocusGuideView
      // style={styles.card}
      onFocus={onFocus}
    >
      <Pressable
        onFocus={onFocus}
        style={({ focused }) => [styles.card, focused && styles.focused]}
      >
        <Image source={{ uri: posterUri }} style={styles.poster} />
        {/* <Text numberOfLines={1} style={styles.title}>{title}tttt</Text> */}
      </Pressable>
    </TVFocusGuideView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    marginHorizontal: 6,
    // marginVertical: 16,
    // borderWidth: 1,
    // borderColor: 'blue',
    height: 300,
    // height: '100%',
  },
  focused: {
    transform: [{ scale: 1.0 }],
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    borderColor: '#fff',
    borderWidth: 2,
    // height: 280
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
});
