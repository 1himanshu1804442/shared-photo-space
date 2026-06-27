import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Camera } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import client from '@/api/client';
import { theme } from '@/styles/theme';

export default function Home() {
  const router = useRouter();
  
  // Join Form State
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');
  const [joinPhone, setJoinPhone] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Create Form State
  const [createName, setCreateName] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [eventName, setEventName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleJoin = async () => {
    if (!joinName || !joinPhone || joinCode.length !== 6) {
      Alert.alert('Validation Error', 'Please fill all fields and provide a 6-digit code.');
      return;
    }
    setIsJoining(true);
    try {
      const res = await client.post(`/events/${joinCode}/join`, {
        name: joinName,
        phoneNumber: joinPhone
      });
      if (Platform.OS === 'web') {
        localStorage.setItem('token', res.data.token);
      } else {
        await SecureStore.setItemAsync('token', res.data.token);
      }
      router.push(`/event/${res.data.event.id}`);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Invalid join code or error joining event.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreate = async () => {
    if (!createName || !createPhone || !eventName) {
      Alert.alert('Validation Error', 'Please fill all fields.');
      return;
    }
    setIsCreating(true);
    try {
      const res = await client.post('/events', {
        name: eventName,
        hostName: createName,
        hostPhoneNumber: createPhone
      });
      if (Platform.OS === 'web') {
        localStorage.setItem('token', res.data.token);
      } else {
        await SecureStore.setItemAsync('token', res.data.token);
      }
      router.push(`/event/${res.data.event.id}`);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Error creating event.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Shared Photo <Text style={styles.gradientText}>Space</Text></Text>
          <Text style={styles.subtitle}>The AI-powered memory platform</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Users size={32} color={theme.colors.primary} />
          </View>
          <Text style={styles.cardTitle}>Join an Event</Text>
          
          <TextInput style={styles.input} placeholder="Your Name" placeholderTextColor={theme.colors.textMuted} value={joinName} onChangeText={setJoinName} />
          <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor={theme.colors.textMuted} keyboardType="phone-pad" value={joinPhone} onChangeText={setJoinPhone} />
          <TextInput style={styles.input} placeholder="6-Digit Join Code" placeholderTextColor={theme.colors.textMuted} maxLength={6} autoCapitalize="none" value={joinCode} onChangeText={setJoinCode} />
          
          <TouchableOpacity style={styles.button} onPress={handleJoin} disabled={isJoining}>
            <Text style={styles.buttonText}>{isJoining ? 'Joining...' : 'Join Gallery'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { marginTop: 24 }]}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
            <Camera size={32} color={theme.colors.secondary} />
          </View>
          <Text style={styles.cardTitle}>Create an Event</Text>
          
          <TextInput style={styles.input} placeholder="Your Name" placeholderTextColor={theme.colors.textMuted} value={createName} onChangeText={setCreateName} />
          <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor={theme.colors.textMuted} keyboardType="phone-pad" value={createPhone} onChangeText={setCreatePhone} />
          <TextInput style={styles.input} placeholder="Event Name (e.g. Goa Trip)" placeholderTextColor={theme.colors.textMuted} value={eventName} onChangeText={setEventName} />
          
          <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleCreate} disabled={isCreating}>
            <Text style={styles.buttonText}>{isCreating ? 'Creating...' : 'Create Event'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  gradientText: {
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.surfaceHighlight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  createButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
