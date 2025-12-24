import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Button, Alert } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useState, useCallback, useEffect } from 'react';
import Constants from 'expo-constants';

const BACKEND_URL = Constants.expoConfig?.extra?.baseUrl ?? 'http://localhost:3000';
interface Card {
  _id: string;
  question: string;
  answer: string;
  isFavorite: boolean;
  deckId: string;
  createdAt: string;
}

interface Deck {
  _id: string;
  title: string;
  createdAt: string;
}

interface Event {
  _id: string;
  title: string;
  start: string;
  end: string;
  weekly: boolean;
  plan: string;
  person: string;
  location: string;
}

export default function EventDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const eventResponse = await fetch(`${BACKEND_URL}/api/events/${id}`);
      if (eventResponse.ok) {
        const eventData: Event = await eventResponse.json();
        setEvent(eventData);
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${BACKEND_URL}/api/events/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                Alert.alert('Success', 'Event deleted successfully', [
                  { text: 'OK', onPress: () => router.back() }
                ]);
              } else {
                throw new Error('Failed to delete event');
              }
            } catch (error) {
              console.error('Error deleting event:', error);
              Alert.alert('Error', 'Failed to delete event');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{event?.title || 'Loading...'}</Text>
          <Text>From {event?.start} to {event?.end}</Text>
          <Text>Location: {event?.location || 'None'}</Text>
          <Text>With: {event?.person || 'None'}</Text>
          <Text> {event?.weekly ? 'Weekly event' : ''}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={deleteEvent}
        >
          <Text style={styles.deleteButtonText}>Delete Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  },
  cardContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    marginBottom: 3,
    marginTop: 5,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginLeft: 10,
  },
  favoriteButtonActive: {
    backgroundColor: '#FFD700',
  },
  favoriteButtonText: {
    fontSize: 20,
    color: '#ccc',
  },
  favoriteButtonTextActive: {
    color: '#FF8C00',
  },
});
