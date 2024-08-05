import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';

const DocumentListScreen = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`https://api-replacer-docx.vercel.app/templates`);
        setDocuments(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const renderItem = ({ item }) => {
    const uploadDate = item.createdAt && item.createdAt._seconds 
      ? new Date(item.createdAt._seconds * 1000).toLocaleDateString() 
      : 'Invalid date';

    return (
      <TouchableOpacity style={styles.card}>
        <Link 
          href={{
            pathname: '/(details)/[id]',
            params: { 
              id: item.id,
              tags: JSON.stringify(item.tags) 
            },
          }} 
          style={styles.cardContent}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="document-text-outline" size={40} color="#BB86FC" style={styles.cardIcon} />
            <View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDate}>Uploaded on: {uploadDate}</Text>
            </View>
          </View>
        </Link>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <Text style={styles.message}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.message}>Error loading documents</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Format Surat</Text>
      </View>
      <FlatList
        data={documents}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20
  },
  card: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cardDate: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  message: {
    fontSize: 18,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DocumentListScreen;
