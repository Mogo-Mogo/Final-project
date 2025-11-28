import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
     <Tabs>
      <Tabs.Screen
        name="[user]"
        options={{
          // Ensure the tab always links to the same href.
          href: '/evanbacon',
          // OR you can use the href object.
          },
        }}
      />
    </Tabs>
  );
}
