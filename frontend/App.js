import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleAddOrUpdate = () => {
    if (taskInput.trim() === '') return;

    if (editingId) {
      // Update task
      setTasks(prev =>
        prev.map(task =>
          task.id === editingId ? { ...task, text: taskInput } : task
        )
      );
      setEditingId(null);
    } else {
      // Add task
      const newTask = {
        id: Date.now().toString(),
        text: taskInput,
        completed: false,
      };
      setTasks(prev => [...prev, newTask]);
    }

    setTaskInput('');
  };

  const toggleComplete = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEdit = (task) => {
    setTaskInput(task.text);
    setEditingId(task.id);
  };

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setTaskInput('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 To-Do List</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleComplete(item.id)} style={styles.taskTextContainer}>
              <Text style={[styles.taskText, item.completed && styles.completed]}>
                {item.completed ? '✅ ' : '☑️ '} {item.text}
              </Text>
            </TouchableOpacity>

            <View style={styles.actionIcons}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.icon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.icon}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.inputSection}>
        <TextInput
          placeholder="Type a task..."
          value={taskInput}
          onChangeText={setTaskInput}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleAddOrUpdate} style={styles.addButton}>
          <Text style={styles.addButtonText}>{editingId ? '🔄' : '➕'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40, backgroundColor: '#f5f5f5' },
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  taskTextContainer: { flex: 1 },
  taskText: { fontSize: 16 },
  completed: { textDecorationLine: 'line-through', color: '#757575' },
  actionIcons: { flexDirection: 'row', gap: 10 },
  icon: { fontSize: 20, marginLeft: 10 },
  inputSection: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 6,
  },
  addButtonText: { color: '#fff', fontSize: 18 },
});
