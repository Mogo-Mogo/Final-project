import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
        <Tabs.Screen
          name="home"
            options={{
          tabBarLabel: "Home",
          title: "Home"
        }}
      />
    </Tabs>
  );
}
