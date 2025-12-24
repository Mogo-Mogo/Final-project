import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import { useAudioPlayer } from 'expo-audio';

const BACKEND_URL = Constants.expoConfig?.extra?.baseUrl ?? 'http://localhost:3000';
const AUDIO_1 = require('../../assets/click1.mp3');
const AUDIO_2 = require('../../assets/click2.mp3');

export default function CreateEventPage() {
    const [eventTitle, setEventTitle] = useState('');
    const [start, setStartDate] = useState(new Date(Date.now()));
    const [end, setEndDate] = useState(new Date(Date.now() + 60 * 15 * 1000));
    const [loading, setLoading] = useState(false);
    const [showDatePicker1, setShowDatePicker1] = useState(false);
    const [showDatePicker2, setShowDatePicker2] = useState(false);
    const [showTimePicker1, setShowTimePicker1] = useState(false);
    const [showTimePicker2, setShowTimePicker2] = useState(false);
    const [weekly, setWeekly] = useState(false);
    const [person, setPerson] = useState('');
    const [location, setLocation] = useState('');
    const router = useRouter();
    const player1 = useAudioPlayer(AUDIO_1);
    const player2 = useAudioPlayer(AUDIO_2);

    const handleStartDateChange = (event: any, selectedDate: Date | undefined) => {
        if (Platform.OS === 'android') {
            setShowDatePicker1(false);
            setShowTimePicker1(false);
            setShowDatePicker2(false);
            setShowTimePicker2(false);
        }
        if (selectedDate) {
            player2.seekTo(0);
            player2.play();
            setStartDate(prev => {
                const next = new Date(selectedDate);
                next.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
                if (end < next) {
                    setEndDate(next);
                }
                return next;
            });
        }
    };

    const handleStartTimeChange = (event: any, selectedTime: Date | undefined) => {
        if (Platform.OS === 'android') {
            setShowDatePicker1(false);
            setShowTimePicker1(false);
            setShowDatePicker2(false);
            setShowTimePicker2(false);
        }
        if (selectedTime) {
            setStartDate(prev => {
                player1.seekTo(0);
                player1.play();
                const next = new Date(prev);
                next.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
                if (end < next) {
                    setEndDate(next);
                }
                return next;
            });
        }
    };

    const handleEndDateChange = (event: any, selectedDate: Date | undefined) => {
        if (Platform.OS === 'android') {
            setShowDatePicker1(false);
            setShowTimePicker1(false);
            setShowDatePicker2(false);
            setShowTimePicker2(false);
        }
        if (selectedDate) {
            player1.seekTo(0);
            player1.play();
            setEndDate(prev => {
                const next = new Date(selectedDate);
                next.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
                return next;
            });
        }
    };

    const handleEndTimeChange = (event: any, selectedTime: Date | undefined) => {
        if (Platform.OS === 'android') {
            setShowDatePicker1(false);
            setShowTimePicker1(false);
            setShowDatePicker2(false);
            setShowTimePicker2(false);
        }
        if (selectedTime) {
            player1.seekTo(0);
            player1.play();
            setEndDate(prev => {
                const next = new Date(prev);
                next.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
                return next;
            });
        }
    };

    const createEvent = async () => {
        if (!eventTitle.trim()) {
            Alert.alert('Error', 'Please enter an event title');
            return;
        }
        player2.seekTo(0);
        player2.play();
        setLoading(true);
        try {
            console.log(JSON.stringify({ title: eventTitle.trim(), start: start, end: end, weekly: weekly, plan: false, person: person, location: location }));
            const response = await fetch(`${BACKEND_URL}/api/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: eventTitle.trim(), start: start, end: end, weekly: weekly, plan: false, person: person, location: location }),
            });
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Backend error:', response.status, errorData);
                throw new Error(`Failed to create event: ${response.status}`);
            }
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Event Title (required)"
                value={eventTitle}
                onChangeText={setEventTitle}
                placeholderTextColor="#999"
            />

            <Text>Start:</Text>
            <View style={styles.timeContainer}>
                <Pressable
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker1(true)}
                >
                    <Text style={styles.dateButtonText}>
                        {start.toLocaleDateString()}
                    </Text>
                </Pressable>
                {showDatePicker1 && (
                    <DateTimePicker
                        value={start}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleStartDateChange}
                    />
                )}
                <Pressable
                    style={styles.dateButton}
                    onPress={() => setShowTimePicker1(true)}
                >
                    <Text style={styles.dateButtonText}>
                        {start.toLocaleTimeString()}
                    </Text>
                </Pressable>
                {showTimePicker1 && (
                    <DateTimePicker
                        value={start}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleStartTimeChange}
                    />
                )}
            </View>

            <Text>End:</Text>
            <View style={styles.timeContainer}>
                <Pressable
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker2(true)}
                >
                    <Text style={styles.dateButtonText}>
                        {end.toLocaleDateString()}
                    </Text>
                </Pressable>
                {showDatePicker2 && (
                    <DateTimePicker
                        value={end}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleEndDateChange}
                    />
                )}
                <Pressable
                    style={styles.dateButton}
                    onPress={() => setShowTimePicker2(true)}
                >
                    <Text style={styles.dateButtonText}>
                        {end.toLocaleTimeString()}
                    </Text>
                </Pressable>
                {showTimePicker2 && (
                    <DateTimePicker
                        value={end}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleEndTimeChange}
                    />
                )}
            </View>

            <TextInput
                style={styles.input}
                placeholder="Person"
                value={person}
                onChangeText={setPerson}
                placeholderTextColor="#999"
            />
            <TextInput
                style={styles.input}
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
                placeholderTextColor="#999"
            />
            <Text>Weekly?</Text>
            <Checkbox
                value={weekly}
                onValueChange={setWeekly}
            />
            <TouchableOpacity
                style={[styles.createButton, loading && styles.disabledButton]}
                onPress={createEvent}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Creating...' : 'Create Event'}
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