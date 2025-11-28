import { Tabs } from 'expo-router';

export default function DecksLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="decks" options={{ title: 'decks' }} />
      <Tabs.Screen name="study" options={{ title: 'study' }} />
      <text></text>
    </Tabs>
  );
}
