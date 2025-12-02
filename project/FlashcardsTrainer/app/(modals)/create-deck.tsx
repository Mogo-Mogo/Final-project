import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function CreateDeckPage() {
  const [deckTitle, setDeckTitle] = useState('');
  const [cards, setCards] = useState([{ question: '', answer: '' }]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addCard = () => {
    setCards([...cards, { question: '', answer: '' }]);
  };

  const updateCard = (index: number, field: 'question' | 'answer', value: string) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const removeCard = (index: number) => {
    if (cards.length > 1) {
      setCards(cards.filter((_, i) => i !== index));
    }
  };

  const BACKEND_URL = 'https://ubiquitous-journey-wrrp96vxrggpfgjqg-3000.app.github.dev/';

  const createDeck = async () => {
    if (!deckTitle.trim()) {
      Alert.alert('Error', 'Please enter a deck title');
      return;
    }

    const validCards = cards.filter(card => 
      card.question.trim() && card.answer.trim()
    );

    if (validCards.length === 0) {
      Alert.alert('Error', 'Please add at least one complete card');
      return;
    }

    setLoading(true);

    try {
      // Create deck first
      const deckResponse = await fetch(`${BACKEND_URL}/api/decks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: deckTitle.trim() }),
      });

      if (!deckResponse.ok) {
        const errorData = await deckResponse.text();
        console.error('Backend error:', deckResponse.status, errorData);
        throw new Error(`Failed to create deck: ${deckResponse.status}`);
      }

      const deck = await deckResponse.json();

      // Create cards for the deck
      for (const card of validCards) {
        const cardResponse = await fetch(`${BACKEND_URL}/api/decks/${deck._id}/cards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: card.question.trim(),
            answer: card.answer.trim(),
          }),
        });

        if (!cardResponse.ok) {
          console.warn('Failed to create card:', card);
        }
      }

      Alert.alert('Success', 'Deck created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);

    } catch (error) {
      console.error('Error creating deck:', error);
      Alert.alert('Error', 'Failed to create deck. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Deck</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Deck Title"
        value={deckTitle}
        onChangeText={setDeckTitle}
      />

      <Text style={styles.sectionTitle}>Cards:</Text>
      
      {cards.map((card, index) => (
        <View key={index} style={styles.cardContainer}>
          <Text style={styles.cardNumber}>Card {index + 1}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Question"
            value={card.question}
            onChangeText={(value) => updateCard(index, 'question', value)}
            multiline
          />
          
          <TextInput
            style={styles.input}
            placeholder="Answer"
            value={card.answer}
            onChangeText={(value) => updateCard(index, 'answer', value)}
            multiline
          />
          
          {cards.length > 1 && (
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeCard(index)}
            >
              <Text style={styles.removeButtonText}>Remove Card</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addCard}>
        <Text style={styles.buttonText}>Add Another Card</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.createButton, loading && styles.disabledButton]} 
        onPress={createDeck}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating...' : 'Create Deck'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    minHeight: 50,
  },
  cardContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});