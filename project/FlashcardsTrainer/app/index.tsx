import { Redirect } from 'expo-router';
import { View, Text } from 'react-native';


export default function App() {
  return <Redirect href={"/(tabs)/tasks"} />;
}