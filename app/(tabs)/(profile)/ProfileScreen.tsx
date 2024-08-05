import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ActivityIndicator, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut, getAuth } from 'firebase/auth';
import { auth } from '../../../FirebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const user = getAuth().currentUser;
      if (user) {
        console.log(`User UID: ${user.uid}`); // Log the UID here
        try {
          const response = await axios.get(`https://api-replacer-docx.vercel.app/profile/${user.uid}`);
          setProfileData(response.data);
        } catch (err) {
          setError('Error fetching profile data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  const handleEdit = () => {
    router.push('/(profile)/EditProfileScreen'); // Navigate to the edit profile screen
  };

  const handleWhatsApp = () => {
    const phoneNumber = '6285937095557'; // Replace with the target phone number
    const url = `whatsapp://send?phone=${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      setError('Unable to open WhatsApp');
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#BB86FC" style={styles.activityIndicator} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
            <Icon name="pencil-outline" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
            <Icon name="log-out-outline" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleWhatsApp} style={styles.iconButton}>
            <Icon name="logo-whatsapp" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      {profileData && (
        <ScrollView contentContainerStyle={styles.profileContainer}>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{profileData.email}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>NIK:</Text>
            <Text style={styles.value}>{profileData.nik || 'N/A'}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Tanggal Lahir:</Text>
            <Text style={styles.value}>{profileData.tanggalLahir || 'N/A'}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Tempat Lahir:</Text>
            <Text style={styles.value}>{profileData.tempatLahir || 'N/A'}</Text>
          </View>
        </ScrollView>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 5,
  },
  profileContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileItem: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4B4B4B',
  },
  label: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  error: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;