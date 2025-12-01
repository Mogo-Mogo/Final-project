import { View, Text, StyleSheet } from 'react-native';

export default function CardPage() {
  return (
    <View style={styles.container}>
      <Text>Create Card page</Text>
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