import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { shareAsync } from 'expo-sharing';

const DetailScreen = () => {
    const { tags, id } = useLocalSearchParams();
    const router = useRouter();

    const parsedTags = tags ? JSON.parse(tags as string) : [];
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (tag: string, value: string) => {
        setInputValues(prevValues => ({ ...prevValues, [tag]: value }));
    };

    const transformTagName = (tagName: string) => {
        return tagName.replace(/^t\./, '').replace(/_/g, ' ');
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const requestData = {
                templateId: id,
                ...parsedTags.reduce((acc, tag) => {
                    acc[tag] = inputValues[tag] || '';
                    return acc;
                }, {} as { [key: string]: string })
            };

            const response = await fetch(`https://api-replacer-docx.vercel.app/generate-docx`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                throw new Error('Invalid content type');
            }

            const arrayBuffer = await response.arrayBuffer();
            if (arrayBuffer.byteLength === 0) {
                throw new Error('Downloaded file is empty');
            }

            const filename = determineFilename();
            const fileUri = FileSystem.documentDirectory + filename;
            const base64 = arrayBufferToBase64(arrayBuffer);
            
            await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
            await save(fileUri, filename, contentType);

            Alert.alert('Success', 'Document generated and downloaded successfully.');
        } catch (error) {
            console.error('Error generating document:', error);
            Alert.alert('Error', 'An error occurred while generating the document.');
        } finally {
            setLoading(false);
        }
    };

    const determineFilename = () => {
        return 'document_' + new Date().toISOString() + '.docx';
    };

    const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) => {
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const save = async (uri: string, filename: string, mimetype: string) => {
        if (Platform.OS === 'android') {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
                    .then(async (fileUri) => {
                        await FileSystem.writeAsStringAsync(fileUri, await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 }), { encoding: FileSystem.EncodingType.Base64 });
                    })
                    .catch(e => console.log(e));
            } else {
                shareAsync(uri);
            }
        } else {
            shareAsync(uri);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Detail Document</Text>
            </View>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#BB86FC" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    <Ionicons name="document-text-outline" size={60} color="#BB86FC" style={styles.icon} />
                    {parsedTags.map((tag: string, index: number) => (
                        <TextInput
                            key={index}
                            style={styles.input}
                            placeholder={transformTagName(tag)}
                            placeholderTextColor="#B0B0B0"
                            value={inputValues[tag] || ''}
                            onChangeText={(value) => handleInputChange(tag, value)}
                        />
                    ))}
                    <TouchableOpacity onPress={handleGenerate} style={styles.generateButton}>
                        <Text style={styles.generateButtonText}>Generate and Download</Text>
                    </TouchableOpacity>
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
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: '#1F1F1F',
        borderBottomWidth: 1,
        borderBottomColor: '#4B4B4B',
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        fontSize: 32,
        color: '#FFFFFF',
    },
    content: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    icon: {
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: '#1F1F1F',
        color: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    generateButton: {
        backgroundColor: '#BB86FC',
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginTop: 20,
    },
    generateButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DetailScreen;
