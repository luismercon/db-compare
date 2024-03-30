import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TodoSchema } from './schemas'
import Realm from 'realm';


export default function App() {

  const [todos, setTodos] = useState([]);
  const [realm, setRealm] = useState(null);
  const [ms, setMs] = useState(0);
  const qtt = 100000;

  useEffect(() => {
    Realm.open({
      schema: [TodoSchema],
    }).then(realm => {
      setRealm(realm);
      const tasks = realm.objects('Todo');
      console.log("Tasks lenght", tasks.length());
      setTodos([...tasks]);
      tasks.addListener(() => {
        setTodos([...tasks]);
      });
    });

    console.log('FIM')

    return () => {
      if (realm !== null) {
        realm.close();
      }
    }

  }, []);

  useEffect(() => {
    console.log('Finish transaction')
  }, [ms])


  const insert100 = () => {
    let init = Date.now();
    console.log(`inserting ${qtt} entries in DB`)
    for (let i = 0; i < qtt; i++) {
      realm.write(() => {
        realm.create('Todo', {
          _id: Date.now(),
          text: i.toString(),
          completed: false,
        });
      });
    }
    let end = Date.now();
    setMs(end - init)
  }

  const deleteAll = () => {
    let init = Date.now();
    console.log('Deleting all entries in DB');

    realm.write(() => {
      realm.deleteAll(); // Delete all objects in a single transaction
    });

    let end = Date.now();
    setMs(end - init);
  };

  const getCount = (className) => {
    const results = realm.objects(className);
    console.log('----------------')
    console.log(results);
    console.log('----------------')
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
  },
});
