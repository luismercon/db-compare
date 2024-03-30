import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

// Open (and create if it doesn't exist) a SQLite database named app.db
const db = SQLite.openDatabase('app.db');


export default function App() {

  const [todos, setTodos] = useState([]);
  const [ms, setMs] = useState(0);
  const qtt = 100000;

  useEffect(() => {
    // Initialize db
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Todo (
        _id INTEGER PRIMARY KEY NOT NULL,
        text TEXT NOT NULL,
        completed INTEGER NOT NULL
      );`,
        [],
        () => console.log('Table created'),
        (_, error) => console.log("Error creating table", error)
      )
    })

    loadTodos();
    return () => {
      db._db.close(() => console.log('DB closed'), error => console.log('DB close error', error))
    };

  }, [])

  const loadTodos = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Todo', [], (_, { rows: { _array } }) => {
        setTodos(_array);
      });
    });
  };


  useEffect(() => {
    console.log('Finish transaction')
  }, [ms])


  const insert100 = () => {
    let init = Date.now();
    db.transaction(tx => {
      for (let i = 0; i < qtt; i++) {
        tx.executeSql('INSERT INTO Todo (text, completed) VALUES (?, ?)', [i.toString(), 0]);
      }
    }, null, () => {
      let end = Date.now();
      setMs(end - init);
      loadTodos();
    });
  };

  const deleteAll = () => {
    let init = Date.now();
    db.transaction(tx => {
      tx.executeSql('DELETE FROM Todo', []);
    }, null, () => {
      let end = Date.now();
      setMs(end - init);
      loadTodos();
    });
  };

  const getCount = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT COUNT(*) AS count FROM Todo', [], (_, { rows }) => {
        console.log('----------------');
        console.log('Count:', rows.item(0).count);
        console.log('----------------');
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text>{qtt} entries in: {ms}</Text>
      <Pressable onPress={() => insert100()}>
        <Text>Press</Text>
      </Pressable>

      <Pressable onPress={() => deleteAll()}>
        <Text>Delete All</Text>
      </Pressable>

      <Pressable onPress={() => getCount('Todo')}>
        <Text>Get Count</Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px'
  },
});
