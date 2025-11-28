import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
        <Tabs.Screen
        name="(decks)"
        options={{
            tabBarLabel: "Decks",
            title: "Decks"
        }}
      />
    </Tabs>
  );
}
