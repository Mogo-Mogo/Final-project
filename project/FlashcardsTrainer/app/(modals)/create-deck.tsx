import { View, Text, StyleSheet } from 'react-native';

export default function DeckPage() {
  return (
    <View style={styles.container}>
      <Text>Deck page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});