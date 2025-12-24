import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Button } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import Slider from '@react-native-community/slider';
import Constants from 'expo-constants';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';

const BACKEND_URL = Constants.expoConfig?.extra?.baseUrl ?? 'http://localhost:3000';
const AUDIO_FILE = require('../../../assets/super-mario-coin-sound.mp3');

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progressById, setProgressById] = useState<Record<string, number>>({});
  const router = useRouter();
  const player = useAudioPlayer(AUDIO_FILE);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/tasks/long`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        setProgressById(
          Object.fromEntries(
            data.map((t) => [t._id, (1 - t.completion) * 100])
          )
        );
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const handleCreateTask = () => {
    router.push('/(modals)/create-task');
  };

  const updateProgressLocal = (taskId: string, value: number) => {
    setProgressById((prev) => ({ ...prev, [taskId]: value }));
  };

  const updateProgress = async (taskId: string, value: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completion: 1 - (value / 100.0001) }),
        //lazy way to avoid division by zero
      });
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    player.seekTo(0);
    player.play();
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
    try {
      const response = await fetch(`${BACKEND_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        await fetchTasks();
      } else {
        console.error('Failed to update task:', response.status);
      }
    } catch (error) {
      console.error('Error updating tasks:', error);
    };
  };

  const renderTask = ({ item }) => {
    const dueText = new Date(item.dueDate).toLocaleDateString();
    const isOverdue = new Date(item.dueDate) < new Date();
    return (
      <TouchableOpacity
        style={isOverdue ? styles.overdueCard : styles.taskCard}
      >
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDate}>Due date: {dueText}</Text>
        <Text style={styles.taskDate}>Work remaining: {Math.round(item.work * (1 - progressById[item._id] / 100))}</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={100}
          step={10}
          value={progressById[item._id]}
          onValueChange={(value) => updateProgressLocal(item._id, value)}
          onSlidingComplete={(value) => updateProgress(item._id, value)}    // persist
        />
        <Button title="✔" onPress={() => deleteTask(item._id)} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Tasks</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
          <Text style={styles.buttonText}>+ New Task</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />
      ) : tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No tasks :)</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item._id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  taskCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  overdueCard: {
    backgroundColor: '#ffe6e6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  taskDate: {
    fontSize: 12,
    color: '#666',
  },
});