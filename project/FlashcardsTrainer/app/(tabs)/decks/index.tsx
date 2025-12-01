import { View, Text, StyleSheet } from 'react-native';

export default function DeckPage() {
  return (
    <View style={styles.container}>
      <Text>These are your decks</Text>
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
