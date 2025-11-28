import { View, Text, StyleSheet } from 'react-native';

export default function Page() {
  return <Text>Index page of Home Tab</Text>;
}

export function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab [Home|Settings]</Text>
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
