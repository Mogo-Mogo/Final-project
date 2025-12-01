import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ presentation: "modal", title: "Your decks" }}
      />
      <Stack.Screen
        name="(modals)/create-card"
        options={{ presentation: "modal", title: "New Card" }}
      />
      <Stack.Screen
        name="(modals)/create-deck"
        options={{ presentation: "modal", title: "New Deck" }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    
  );
}