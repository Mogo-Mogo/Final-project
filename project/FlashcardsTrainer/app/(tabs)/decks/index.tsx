import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';

export default function Page() {
  return (
    <View style={styles.container}>
      <Text>Index page of Home Tab</Text>
    </View>
    
  );
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
