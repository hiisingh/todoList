import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [approvedTasks, setApprovedTasks] = useState([]);
  const [rejectedTasks, setRejectedTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalPendingTasks, setTotalPendingTasks] = useState(0);
  const [activeScreen, setActiveScreen] = useState('Home');

  useEffect(() => {
    setTotalTasks(tasks.length);
    setTotalPendingTasks(tasks.filter(task => !task.completed).length);
  }, [tasks]);

  const addTask = () => {
    if (taskInput.trim() !== '') {
      const newTask = { id: Date.now(), text: taskInput, completed: false };
      setTasks([...tasks, newTask]);
      setTaskInput('');
      setActiveScreen('Home');
    }
  };

  const startEditTask = (taskId) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    setTaskInput(taskToEdit.text);
    setEditingTask(taskId);
    setActiveScreen('EditTask');
  };

  const saveEditedTask = () => {
    if (taskInput.trim() !== '') {
      setTasks(tasks.map(task => (task.id === editingTask ? { ...task, text: taskInput } : task)));
      setEditingTask(null);
      setTaskInput('');
      setActiveScreen('Home');
    }
  };

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const approveTask = (taskId) => {
    const taskToApprove = tasks.find(task => task.id === taskId);
    setApprovedTasks([...approvedTasks, taskToApprove]);
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const rejectTask = (taskId) => {
    const taskToReject = tasks.find(task => task.id === taskId);
    setRejectedTasks([...rejectedTasks, taskToReject]);
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const deleteApprovedTask = (taskId) => {
    setApprovedTasks(approvedTasks.filter(task => task.id !== taskId));
  };

  const deleteRejectedTask = (taskId) => {
    setRejectedTasks(rejectedTasks.filter(task => task.id !== taskId));
  };

  // ------------------ SCREENS --------------------

  const renderHome = () => (
    <View style={styles.screen}>
      <Text style={styles.title}>📌 To-Do List</Text>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={[styles.taskText, item.completed && styles.completedTask]}>{item.text}</Text>
            <View style={styles.taskButtons}>
              <TouchableOpacity onPress={() => toggleComplete(item.id)} style={styles.btnSmall}>
                <Text style={styles.btnSmallText}>{item.completed ? 'Undo' : 'Done'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => startEditTask(item.id)} style={styles.btnSmallEdit}>
                <Text style={styles.btnSmallText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.btnSmallDelete}>
                <Text style={styles.btnSmallText}>Del</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => approveTask(item.id)} style={styles.btnSmallApprove}>
                <Text style={styles.btnSmallText}>✓</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => rejectTask(item.id)} style={styles.btnSmallReject}>
                <Text style={styles.btnSmallText}>✗</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />

      <View style={styles.section}>
        <Text style={styles.subtitle}>✅ Approved</Text>
        {approvedTasks.map(task => (
          <View key={task.id} style={styles.taskCardApproved}>
            <Text style={styles.taskText}>{task.text}</Text>
            <TouchableOpacity onPress={() => deleteApprovedTask(task.id)} style={styles.btnSmallDelete}>
              <Text style={styles.btnSmallText}>Del</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>❌ Rejected</Text>
        {rejectedTasks.map(task => (
          <View key={task.id} style={styles.taskCardRejected}>
            <Text style={styles.taskText}>{task.text}</Text>
            <TouchableOpacity onPress={() => deleteRejectedTask(task.id)} style={styles.btnSmallDelete}>
              <Text style={styles.btnSmallText}>Del</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAddTask = () => (
    <View style={styles.screen}>
      <Text style={styles.title}>➕ Add a Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new task"
        value={taskInput}
        onChangeText={setTaskInput}
      />
      <TouchableOpacity onPress={addTask} style={styles.btnPrimary}>
        <Text style={styles.btnPrimaryText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEditTask = () => (
    <View style={styles.screen}>
      <Text style={styles.title}>✏️ Edit Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Edit task"
        value={taskInput}
        onChangeText={setTaskInput}
      />
      <TouchableOpacity onPress={saveEditedTask} style={styles.btnPrimary}>
        <Text style={styles.btnPrimaryText}>Save</Text>
      </TouchableOpacity>
    </View>
  );

const renderDashboard = () => (
  <View style={styles.dashboardContainer}>
    <Text style={styles.title}>📊 Dashboard</Text>
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <Text style={styles.tableHeader}>Metric</Text>
        <Text style={styles.tableHeader}>Value</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Total Tasks</Text>
        <Text style={styles.tableCell}>{totalTasks}</Text>
      </View>
      <View style={styles.tableRowAlt}>
        <Text style={styles.tableCell}>Pending</Text>
        <Text style={styles.tableCell}>{totalPendingTasks}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Approved</Text>
        <Text style={styles.tableCell}>{approvedTasks.length}</Text>
      </View>
      <View style={styles.tableRowAlt}>
        <Text style={styles.tableCell}>Rejected</Text>
        <Text style={styles.tableCell}>{rejectedTasks.length}</Text>
      </View>
    </View>
  </View>
);


  // ------------------ RENDER MAIN --------------------
  return (
    <View style={styles.container}>
      {activeScreen === 'Home' && renderHome()}
      {activeScreen === 'AddTask' && renderAddTask()}
      {activeScreen === 'EditTask' && renderEditTask()}
      {activeScreen === 'Dashboard' && renderDashboard()}

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setActiveScreen('Home')}><Text style={styles.footerBtn}>Home</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveScreen('AddTask')}><Text style={styles.footerBtn}>Add</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveScreen('Dashboard')}><Text style={styles.footerBtn}>Dashboard</Text></TouchableOpacity>
      </View>
    </View>
  );
};

// ------------------ STYLES --------------------
// ------------------ STYLES --------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  screen: { flex: 1, padding: 16 },

  // Titles
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#222', textAlign: 'center' },
  subtitle: { fontSize: 20, fontWeight: '600', marginTop: 16, marginBottom: 8, color: '#444' },

  // Sections
  section: { marginTop: 10 },

  // Task Cards
  taskCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  taskCardApproved: {
    backgroundColor: '#d4edda',
    padding: 12,
    marginBottom: 6,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  taskCardRejected: {
    backgroundColor: '#f8d7da',
    padding: 12,
    marginBottom: 6,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  taskText: { fontSize: 16, color: '#333' },
  completedTask: { textDecorationLine: 'line-through', color: '#777' },
  taskButtons: { flexDirection: 'row', gap: 4 },

  // Inputs
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },

  // Buttons
  btnPrimary: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnSmall: { backgroundColor: '#6c757d', padding: 6, borderRadius: 6, marginLeft: 4 },
  btnSmallEdit: { backgroundColor: '#ffc107', padding: 6, borderRadius: 6, marginLeft: 4 },
  btnSmallDelete: { backgroundColor: '#dc3545', padding: 6, borderRadius: 6, marginLeft: 4 },
  btnSmallApprove: { backgroundColor: '#28a745', padding: 6, borderRadius: 6, marginLeft: 4 },
  btnSmallReject: { backgroundColor: '#fd7e14', padding: 6, borderRadius: 6, marginLeft: 4 },
  btnSmallText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  // Dashboard (Table Style)
  dashboardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  table: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    marginTop: 12,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableRowAlt: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableHeader: {
    flex: 1,
    padding: 12,
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  tableCell: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    color: '#333',
    fontSize: 15,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#343a40',
    padding: 12,
  },
  footerBtn: { color: '#fff', fontSize: 16, fontWeight: '600' },
});


export default App;
