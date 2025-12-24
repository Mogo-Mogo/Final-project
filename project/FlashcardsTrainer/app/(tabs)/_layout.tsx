import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="tasks" options={{ title: 'tasks' }} />
      <Tabs.Screen name="home" options={{ title: 'home' }} />
    </Tabs>
  );
}
