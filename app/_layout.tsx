import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { authStore } from './store'; // Adjust the path if needed

const RootLayout = observer(() => {
  const { isLoggedIn, initialized } = authStore;
  const router = useRouter();

  useEffect(() => {
    if (initialized) {
      // Redirect based on authentication state
      if (isLoggedIn) {
        router.replace('/main'); // Navigate to tabs if logged in
      } else {
        router.replace('/login'); // Navigate to login if not logged in
      }
    }
  }, [initialized, isLoggedIn, router]);

  // Optionally, display a loading indicator while initializing
  if (!initialized) {
    return null; // You can replace this with a loading spinner if desired
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
});

export default RootLayout;
