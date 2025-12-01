import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="decks" options={{ title: 'decks', tabBarLabel: 'Decks' }} />
      <Tabs.Screen name="study" options={{ title: 'study', tabBarLabel: 'Study' }} />
    </Tabs>
  );
}
