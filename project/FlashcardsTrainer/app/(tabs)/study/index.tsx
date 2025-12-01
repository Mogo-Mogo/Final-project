import { View, Text, StyleSheet } from 'react-native';

export default function StudyPage() {
  return (
    <View style={styles.container}>
      <Text>Study page</Text>
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