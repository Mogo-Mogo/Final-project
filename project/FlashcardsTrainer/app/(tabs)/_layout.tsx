import { Tabs } from 'expo-router';

export default function DecksLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="decks" options={{ title: 'Decks' }} />
      <Tabs.Screen name="settings" options={{ title: 'Study' }} />
    </Tabs>
  );
}
