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
import { auth, firestore } from '../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Modal from 'react-native-modal';

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Semua kolom harus diisi');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        name,
        email,
        uid: user.uid,
        nik: '',
        tanggal_lahir: '',
        tempat_lahir: '',
      });

      setModalMessage('Registrasi Berhasil. Anda telah berhasil mendaftar.');
      setIsSuccess(true);
      setModalVisible(true);

      // Delay navigation to ensure modal is shown first
      setTimeout(() => {
        setModalVisible(false);
        router.replace('/login');
      }, 2000); // Adjust time as needed to allow modal to appear
    } catch (error: any) {
      let errorMessage = 'Registrasi gagal. Silakan coba lagi.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email sudah digunakan. Silakan coba email lain.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email tidak valid. Masukkan email yang valid.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Kata sandi terlalu lemah. Masukkan kata sandi yang lebih kuat.';
      }

      setError(errorMessage);
      setModalMessage('');
      setIsSuccess(false);
    }
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Registrasi</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama"
        placeholderTextColor="#B0B0B0"
        value={name}
        onChangeText={setName}
      />
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrasi</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.linkText}>Sudah punya akun? Login</Text>
      </TouchableOpacity>

      {/* Modal only for successful registration */}
      {isSuccess && (
        <Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity onPress={hideModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
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
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#BB86FC',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default RegisterScreen;
