import { View, Text, StyleSheet } from 'react-native';

export default function CreateDeckPage() {
  return (
    <View style={styles.container}>
      <Text>Create Deck</Text>
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