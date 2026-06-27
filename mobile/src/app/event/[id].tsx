import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Upload, Image as ImageIcon, Camera } from 'lucide-react-native';
import client from '@/api/client';
import { theme } from '@/styles/theme';

export default function EventDashboard() {
  const { id } = useLocalSearchParams();
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, [id]);

  const fetchPhotos = async () => {
    try {
      const res = await client.get(`/photos/event/${id}`);
      setPhotos(res.data);
    } catch (err) {
      console.error('Error fetching photos', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadWeb = () => {
    // Create a hidden file input for web
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (e: any) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('eventId', id as string);

        try {
          await client.post('/photos/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } catch (err) {
          console.error('Upload failed for', file.name, err);
        }
      }
      setUploading(false);
      fetchPhotos();
    };
    input.click();
  };

  const handleUploadNative = async () => {
    const ImagePicker = require('expo-image-picker');
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'Allow access to your photos to upload.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setUploading(true);
      for (const asset of result.assets) {
        const formData = new FormData();
        const filename = asset.uri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('file', {
          uri: asset.uri,
          name: filename,
          type,
        } as any);

        formData.append('eventId', id as string);

        try {
          await client.post('/photos/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } catch (err) {
          console.error('Upload failed for', filename, err);
        }
      }
      setUploading(false);
      fetchPhotos();
    }
  };

  const handleUpload = Platform.OS === 'web' ? handleUploadWeb : handleUploadNative;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Event Gallery</Text>
          <Text style={styles.headerSub}>{photos.length} photo{photos.length !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Upload size={18} color="#fff" />
              <Text style={styles.uploadButtonText}>Upload</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Photo Grid or Empty State */}
      {photos.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Camera size={48} color={theme.colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No photos yet!</Text>
          <Text style={styles.emptySub}>Be the first to upload a memory.</Text>
          <TouchableOpacity style={styles.emptyUploadBtn} onPress={handleUpload}>
            <Upload size={18} color="#fff" />
            <Text style={styles.emptyUploadText}>Upload Photos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {photos.map((item) => (
            <View key={item.id} style={styles.photoWrapper}>
              <Image source={{ uri: item.storageUrl }} style={styles.photo} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerSub: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    gap: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
  },
  photoWrapper: {
    width: '33.33%',
    padding: 2,
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptySub: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
  },
  emptyUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    gap: 8,
  },
  emptyUploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
