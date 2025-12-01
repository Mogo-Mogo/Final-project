import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <view
    <Stack>
      <Stack.Screen
        name="(modals)/create-deck"
        options={{ presentation: "modal", title: "New Deck" }}
      />
      <Stack.Screen
        name="(modals)/create-card"
        options={{ presentation: "modal", title: "New Card" }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    <Tabs>
      <Tabs.Screen name="decks" options={{ title: 'decks'}} />
      <Tabs.Screen name="study" options={{ title: 'study'}} />
    </Tabs>
  );
}