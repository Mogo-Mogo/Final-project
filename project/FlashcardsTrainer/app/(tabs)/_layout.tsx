import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
     <Tabs>
      <Tabs.Screen
        name="decks"
        options={{
          href: '/decks'
          ,
        }}
      />
    </Tabs>
  );
}
