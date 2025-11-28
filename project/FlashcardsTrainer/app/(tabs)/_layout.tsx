import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
     <Tabs>
      <Tabs.Screen
        // Name of the dynamic route.
        name="[user]"
        options={{
          // Ensure the tab always links to the same href.
          href: '/evanbacon',
          // OR you can use the href object.
          href: {
            pathname: '/[user]',
            params: {
              user: 'evanbacon',
            },
          },
        }}
      />
    </Tabs>
    </Tabs>
  );
}
