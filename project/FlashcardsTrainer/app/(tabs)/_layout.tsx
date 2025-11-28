import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
     <Tabs>
      <Tabs.Screen
        name="decks"
        options={{
          title: 'Decks',
          href: '/decks'
        }}
      />
    </Tabs>
  );
}
