import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAudioPlayer } from 'expo-audio';
import { set } from 'mongoose';

const BACKEND_URL = Constants.expoConfig?.extra?.baseUrl ?? 'http://localhost:3000';
const AUDIO_FILE = require('../../assets/click1.mp3');

export default function CreateTaskPage() {
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [work, setWork] = useState('0');
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const router = useRouter();
  const player = useAudioPlayer(AUDIO_FILE);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
    if (selectedDate) {
      setDueDate(prev => {
        const next = new Date(selectedDate);
        next.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
        return next;
      });
    }
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
    if (selectedTime) {
      setDueDate(prev => {
        const next = new Date(prev);
        next.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
        return next;
      });
    }
  };

  const createTask = async () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    player.seekTo(0);
    player.play();
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: taskTitle.trim(), dueDate: dueDate, work: Math.abs(Number(work)) }),
      });
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', response.status, errorData);
        throw new Error(`Failed to create task: ${response.status}`);
      }
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Task Title (required)"
        value={taskTitle}
        onChangeText={setTaskTitle}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Time Needed (hours)"
        value={work}
        onChangeText={setWork}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />

      <Text>Due Date:</Text>
      <View style={styles.timeContainer}>
        <Pressable
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {dueDate.toLocaleDateString()}
          </Text>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
        <Pressable
          style={styles.dateButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {dueDate.toLocaleTimeString()}
          </Text>
        </Pressable>
        {showTimePicker && (
          <DateTimePicker
            value={dueDate}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.createButton, loading && styles.disabledButton]}
        onPress={createTask}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating...' : (work == '0' || work === '') ? 'Create Short Task' : 'Create Task'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    width: '80%',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    width: 'auto',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});