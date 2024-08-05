import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === '(main)'){
            iconName = 'home';
          } else if (route.name === '(profile)') {
            iconName = 'person';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: () => null, // Hide the label
        tabBarActiveTintColor: '#BB86FC',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#121212' },
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#FFFFFF',
      })}
    >
      <Tabs.Screen name="(main)" options={{ headerShown: false }} />
      <Tabs.Screen name="(profile)" options={{ headerShown: false }} />
    </Tabs>
  );
}
