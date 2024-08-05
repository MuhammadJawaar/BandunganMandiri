import React from 'react';
import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" options={{ title: 'ProfileScreen' }} />
      <Stack.Screen name="EditProfileScreen" options={{ title: 'EditProfileScreen' }} />
    </Stack>
  );
}
