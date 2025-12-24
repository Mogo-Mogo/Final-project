import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Button, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import Constants from 'expo-constants';
import Slider from '@react-native-community/slider';
import { Heap } from 'heap-js';
import { set } from 'mongoose';


const BACKEND_URL = Constants.expoConfig?.extra?.baseUrl ?? 'http://localhost:3000';

interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
}

interface Task {
    title: string;
    dueDate: Date;
    work: number;
    completion: number;
}

export default function PlanPage() {
    const router = useRouter();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [tasks, setTasks] = useState<Heap<Task>>();
    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState<number>(9);
    const [endTime, setEndTime] = useState<number>(22);
    const [interval, setInterval] = useState<number>(2);
    const [days, setDays] = useState<number>(3);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response1 = await fetch(`${BACKEND_URL}/api/tasks/long`);
            const response2 = await fetch(`${BACKEND_URL}/api/events`);
            if (response1.ok && response2.ok) {
                let json = await response1.json()
                let heap = new Heap<Task>(priorityComparator);
                json.forEach((task: Task) => heap.push({
                    title: task.title,
                    dueDate: new Date(task.dueDate),
                    work: task.work * task.completion,
                    completion: task.completion //not used
                }));
                setTasks(heap);
                //only fetch events that are not plans and are in the future, in order of start date
                setEvents((await response2.json())
                    .filter((event: any) =>
                        event.plan === false && new Date(event.end) > new Date(Date.now())
                    )
                    .map((item: any) => ({
                        title: item.title,
                        start: new Date(item.start),
                        end: new Date(item.end)
                    }))
                    .sort((a: CalendarEvent, b: CalendarEvent) =>
                        a.start.getTime() - b.start.getTime()
                    )
                );
            };
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const CreateEvent = async (start: Date, endHour: number) => {
        console.log('Creating event from', start, 'for', endHour, 'hours');
        if (!tasks || tasks.size() === 0) {
            return;
        }
        let task = tasks.pop();
        if (!task) {
            return;
        }
        let end = new Date(start.getTime() + endHour * 60 * 60 * 1000);
        try {
            const response = await fetch(`${BACKEND_URL}/api/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: task.title, start: start, end: end, weekly: false, plan: true, person: "", location: "" }),
            });
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Backend error:', response.status, errorData);
                throw new Error(`Failed to create event: ${response.status}`);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create event');
        }
        task.work -= (endHour - start.getHours());
        if (task.work > 0) {
            tasks.push(task);
        }
        return;
    };

    const priorityComparator = (a: any, b: any) => {
        return a.work / (Math.abs(a.dueDate.getTime() - Date.now())) - b.work / (Math.abs(b.dueDate.getTime() - Date.now()));
    }

    const deletePlan = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/events/plan`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Backend error:', response.status, errorData);
                throw new Error(`Failed to delete plan: ${response.status}`);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to delete plan');
        }
    };

    const handleCreatePlan = async () => {
        setLoading(true);
        await deletePlan();
        let planEnd = new Date();
        planEnd.setDate(new Date(Date.now()).getDate() + days);
        planEnd.setHours(endTime, 0, 0, 0);
        let t = new Date(Date.now());
        t.setHours(t.getHours(), 0, 0, 0);
        while (t < planEnd && tasks && tasks.length > 0) {
            console.log(t);
            //if t is in an event, move t to the end of that event
            if (events.length > 0) {
                let whoops = events.filter((e: any) => e.start <= t && e.end >= t)
                if (whoops.length > 0) {
                    t = new Date(whoops[0].end);
                    //go to the start of the next hour  
                    if (t.getMinutes() > 0 || t.getSeconds() > 0) {
                        t.setHours(t.getHours() + 1, 0, 0, 0);
                    }
                }
            }
            //if t is outside of plan hours, move t to the next day's start time
            if (t.getHours() < startTime) {
                t.setHours(startTime, 0, 0, 0);
            } else if (t.getHours() >= endTime) {
                t.setDate(t.getDate() + 1);
                t.setHours(startTime, 0, 0, 0);
            }
            let jobEnd = Math.min(interval + t.getHours(), endTime);
            if (events.length > 0) {
                jobEnd = Math.min(jobEnd, events[0].start.getHours());
            }
            await CreateEvent(t, jobEnd - t.getHours());
            t.setHours(jobEnd, 0, 0, 0);
        }
        setLoading(false);
        Alert.alert(
            'Success',
            'Plan created successfully',
            [
                {
                    text: 'OK',
                    style: 'default',
                    onPress: () => {
                        router.back();
                    }
                }
            ]
        );
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
                    <Text>Start time: {startTime}</Text>
                    <View style={styles.container}>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={24}
                            step={1}
                            value={startTime}
                            onValueChange={(value) => setStartTime(value)}
                        />
                    </View>
                    <Text>End time: {endTime}</Text>
                    <View style={styles.container}>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={24}
                            step={1}
                            value={endTime}
                            onValueChange={(value) => setEndTime(value)}
                        />
                    </View>
                    <Text>Max interval: {interval}</Text>
                    <View style={styles.container}>

                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={24}
                            step={1}
                            value={interval}
                            onValueChange={(value) => setInterval(value)}
                        />
                    </View>
                    <Text>Total Days: {days}</Text>
                    <View style={styles.container}>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={10}
                            step={1}
                            value={days}
                            onValueChange={(value) => setDays(value)}
                        />
                    </View>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.createButton} onPress={handleCreatePlan}>
                            <Text style={styles.buttonText}>Create Plan</Text>
                        </TouchableOpacity>
                    </View>
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