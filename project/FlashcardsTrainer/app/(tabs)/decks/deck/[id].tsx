import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

const BACKEND_URL = 'https://ubiquitous-journey-wrrp96vxrggpfgjqg-3000.app.github.dev';

export default function DeckDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDeckAndCards();
  }, [id]);

  const fetchDeckAndCards = async () => {
    setLoading(true);
    try {
      // Fetch deck info
      const deckResponse = await fetch(`${BACKEND_URL}/api/decks/${id}`);
      if (deckResponse.ok) {
        const deckData = await deckResponse.json();
        setDeck(deckData);
      }

      // Fetch cards in deck
      const cardsResponse = await fetch(`${BACKEND_URL}/api/decks/${id}/cards`);
      if (cardsResponse.ok) {
        const cardsData = await cardsResponse.json();
        setCards(cardsData);
      }
    } catch (error) {
      console.error('Error fetching deck data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDeck = async () => {
    Alert.alert(
      'Delete Deck',
      'Are you sure you want to delete this deck? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${BACKEND_URL}/api/decks/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                Alert.alert('Success', 'Deck deleted successfully', [
                  { text: 'OK', onPress: () => router.back() }
                ]);
              } else {
                throw new Error('Failed to delete deck');
              }
            } catch (error) {
              console.error('Error deleting deck:', error);
              Alert.alert('Error', 'Failed to delete deck');
            }
          }
        }
      ]
    );
  };

  const toggleFavorite = async (cardId, currentFavorite) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cards/${cardId}/favorite`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        const updatedCard = await response.json();
        setCards(prevCards => 
          prevCards.map(card => 
            card._id === cardId ? updatedCard : card
          )
        );
      } else {
        throw new Error('Failed to toggle favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  const renderCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <Text style={styles.cardLabel}>Q:</Text>
        <Text style={styles.cardText}>{item.question}</Text>
        
        <Text style={styles.cardLabel}>A:</Text>
        <Text style={styles.cardText}>{item.answer}</Text>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.favoriteButton, 
          item.isFavorite && styles.favoriteButtonActive
        ]}
        onPress={() => toggleFavorite(item._id, item.isFavorite)}
      >
        <Text style={[
          styles.favoriteButtonText,
          item.isFavorite && styles.favoriteButtonTextActive
        ]}>
          {item.isFavorite ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    </View>
  );

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
          <Text style={styles.title}>{deck?.title || 'Loading...'}</Text>
          <Text style={styles.cardCount}>{cards.length} cards</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={deleteDeck}
        >
          <Text style={styles.deleteButtonText}>Delete Deck</Text>
        </TouchableOpacity>
      </View>

      {cards.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No cards in this deck</Text>
          <Text style={styles.emptySubtext}>Add some cards to get started</Text>
        </View>
      ) : (
        <FlatList
          data={cards}
          renderItem={renderCard}
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
  cardCount: {
    fontSize: 14,
    color: '#666',
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
