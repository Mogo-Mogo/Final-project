import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

const BACKEND_URL = process.env.BASE_URL ?? 'http://localhost:3000';
interface Card {
  _id: string;
  question: string;
  answer: string;
  isFavorite: boolean;
  deckId: string;
  createdAt: string;
}

export default function StudyPage() {
  const [favoriteCards, setFavoriteCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const fetchFavoriteCards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/cards`);
      if (response.ok) {
        const allCards: Card[] = await response.json();
        const favorites = allCards.filter(card => card.isFavorite);
        setFavoriteCards(favorites);
      }
    } catch (error) {
      console.error('Error fetching favorite cards:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteCards();
    }, [])
  );

  const toggleCardFlip = (cardId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const renderCard = ({ item }: { item: Card }) => {
    const isFlipped = flippedCards.has(item._id);

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => toggleCardFlip(item._id)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.favoriteIcon}>★</Text>
          <Text style={styles.flipHint}>Tap to flip</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>
            {isFlipped ? 'Answer:' : 'Question:'}
          </Text>
          <Text style={styles.cardText}>
            {isFlipped ? item.answer : item.question}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.cardStatus}>
            {isFlipped ? 'Showing Answer' : 'Showing Question'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading favorite cards...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Favorites</Text>
        <Text style={styles.subtitle}>
          {favoriteCards.length} favorite card{favoriteCards.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {favoriteCards.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⭐</Text>
          <Text style={styles.emptyTitle}>No Favorite Cards Yet</Text>
          <Text style={styles.emptyText}>
            Mark cards as favorites in your decks to study them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteCards}
          renderItem={renderCard}
          keyExtractor={(item) => item._id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#FFD700',
  },
  flipHint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  cardContent: {
    marginBottom: 15,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardText: {
    fontSize: 18,
    lineHeight: 26,
    color: '#333',
    minHeight: 26,
  },
  cardFooter: {
    alignItems: 'center',
  },
  cardStatus: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});