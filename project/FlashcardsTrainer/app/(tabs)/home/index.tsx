import { Platform, View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Button } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback, useEffect } from 'react';
import Constants from 'expo-constants';
import { Calendar } from 'react-native-big-calendar'

const BACKEND_URL = Constants.expoConfig?.extra?.baseUrl ?? 'http://localhost:3000';

interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    plan: boolean;
    id: string;
}

export default function HomePage() {
    const router = useRouter();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [activePlan, setActivePlan] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response1 = await fetch(`${BACKEND_URL}/api/tasks/short`);
            const response2 = await fetch(`${BACKEND_URL}/api/tasks/long`);
            const response3 = await fetch(`${BACKEND_URL}/api/events`);
            if (response1.ok && response2.ok && response3.ok) {
                let data = await response1.json();
                data = data.concat(await response2.json());
                const formattedData = data.map((item: any) => ({
                    title: item.title,
                    start: new Date(new Date(item.dueDate).setHours(0, 0, 0, 0)),
                    end: new Date(new Date(item.dueDate).setHours(0, 0, 0, 0)),
                    // makes all day event
                    plan: false,
                    id: ""
                }));
                const allData = formattedData.concat((await response3.json()).map((item: any) => ({
                    title: item.title,
                    start: new Date(item.start),
                    end: new Date(item.end),
                    weekly: item.weekly,
                    plan: item.plan,
                    id: item._id
                })));
                setEvents(allData);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
        finally {
            if (events.find(e => !e.plan) !== undefined) {
                setActivePlan(true);
            } else {
                setActivePlan(false);
            }
            setLoading(false);
        }
    };

    const handleCreateEvent = () => {
        router.push('/(modals)/create-event');
    };

    const handleNewPlan = () => {
        router.push('/(modals)/create-plan');
    };

    const handleEventPress = (event: CalendarEvent) => {
        router.push(`/(tabs)/event/${event.id}`);
    };

    const handleDeletePlan = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/events/plan`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                await fetchItems();
            } else {
                console.error('Failed to clear plan:', response.status);
            }
        } catch (error) {
            console.error('Error clearing plan:', error);
        }
        setActivePlan(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchItems();
        }, [])
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />
            ) : (
                <View>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
                            <Text style={styles.buttonText}>+ New Event</Text>
                        </TouchableOpacity>
                        {activePlan ? <TouchableOpacity style={styles.createButton} onPress={handleDeletePlan}>
                            <Text style={styles.buttonText}>Clear Plan</Text>
                        </TouchableOpacity> :
                            <TouchableOpacity style={styles.createButton} onPress={handleNewPlan}>
                                <Text style={styles.buttonText}>New Plan</Text>
                            </TouchableOpacity>}
                    </View>
                    <Calendar
                        events={events}
                        height={600}
                        theme={styles.calendar}
                        onPressEvent={handleEventPress} />
                    <Text>Tap on an event to see details.</Text>
                </View>
            )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: 20,
        width: '100%',
    },
    calendar: {

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 10,
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
    loading: {
        flex: 1,
        justifyContent: 'center',
    },
});