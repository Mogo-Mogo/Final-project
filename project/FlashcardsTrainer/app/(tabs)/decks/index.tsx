import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function DeckPage() {
  const router = useRouter();

  const handleCreateDeck = () => {
    router.push('/(modals)/create-deck');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>These are your decks</Text>
      
      <TouchableOpacity style={styles.createButton} onPress={handleCreateDeck}>
        <Text style={styles.buttonText}>Create New Deck</Text>
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
  title: {
    fontSize: 18,
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});