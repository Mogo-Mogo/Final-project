import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ presentation: "modal", title: "Your Tasks" }}
      />
      <Stack.Screen
        name="(modals)/create-task"
        options={{ presentation: "modal", title: "New Task" }}
      />
      <Stack.Screen
        name="(modals)/create-event"
        options={{ presentation: "modal", title: "New Event" }}
      />
    </Stack>

  );
}