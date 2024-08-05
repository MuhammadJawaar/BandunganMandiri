import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../FirebaseConfig';
import { authStore } from './store'; // Import your MobX store
import Toast from 'react-native-toast-message';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update MobX store
      authStore.signIn(user);

      // Show success message with Toast
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Login Berhasil',
        text2: 'Anda berhasil login.',
      });

      // Navigate to MainScreen
      router.replace('/main'); // Use replace to avoid going back to login screen
    } catch (error: any) {
      let errorMessage = 'Login gagal. Silakan coba lagi.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Email tidak ditemukan. Silakan daftar terlebih dahulu.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Kata sandi salah. Silakan periksa kembali kata sandi Anda.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email tidak valid. Masukkan email yang valid.';
      }
      
      setError(errorMessage);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Login Gagal',
        text2: errorMessage,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#B0B0B0"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Kata Sandi"
        placeholderTextColor="#B0B0B0"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.linkText}>Belum punya akun? Daftar</Text>
      </TouchableOpacity>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 40,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4B4B4B',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#BB86FC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  linkText: {
    color: '#BB86FC',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  }
});

export default LoginScreen;
