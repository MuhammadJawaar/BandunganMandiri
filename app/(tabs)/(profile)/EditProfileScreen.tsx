import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const EditProfileScreen: React.FC = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [nik, setNik] = useState<string>('');
  const [tanggalLahir, setTanggalLahir] = useState<string>('');
  const [tempatLahir, setTempatLahir] = useState<string>('');

  useEffect(() => {
    const fetchProfileData = async () => {
      const user = getAuth().currentUser;
      if (user) {
        try {
          const response = await axios.get(`https://api-replacer-docx.vercel.app/profile/${user.uid}`);
          setProfileData(response.data);
          setEmail(response.data.email);
          setNik(response.data.nik || '');
          setTanggalLahir(response.data.tanggalLahir || '');
          setTempatLahir(response.data.tempatLahir || '');
        } catch (err) {
          setError('Error fetching profile data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, []);

  const handleSave = async () => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        await axios.put(`https://api-replacer-docx.vercel.app/profile-update/${user.uid}`, {
          email,
          nik,
          tanggalLahir,
          tempatLahir
        });
        Alert.alert('Success', 'Profile updated successfully');
        router.replace('/ProfileScreen');
      } catch (err) {
        setError('Error updating profile');
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#BB86FC" style={styles.activityIndicator} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Edit Profile</Text>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#B0B0B0"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="NIK"
          placeholderTextColor="#B0B0B0"
          value={nik}
          onChangeText={setNik}
        />
        <TextInput
          style={styles.input}
          placeholder="Tanggal Lahir"
          placeholderTextColor="#B0B0B0"
          value={tanggalLahir}
          onChangeText={setTanggalLahir}
        />
        <TextInput
          style={styles.input}
          placeholder="Tempat Lahir"
          placeholderTextColor="#B0B0B0"
          value={tempatLahir}
          onChangeText={setTempatLahir}
        />
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1F1F1F',
    borderBottomWidth: 1,
    borderBottomColor: '#4B4B4B',
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  formContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4B4B4B',
  },
  saveButton: {
    backgroundColor: '#BB86FC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  error: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 15,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfileScreen;
