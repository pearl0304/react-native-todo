import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {Text, View, TouchableOpacity, TextInput, ScrollView, Alert} from 'react-native';
import {styles} from "./src/style/main";
import {useEffect, useState} from "react";
import {theme} from "./src/style/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Fontisto, AntDesign} from "@expo/vector-icons";

const STORAGE_KEY = "@todoList"
const STORAGE_CATEGORY = "@category"


// TODO
/*
* 1. 마지막 상태가 어디였는지 기억하기 - async storage 활요
* 2. done 상태 만들기
* 3. todo 수정하기
* */


export default function App() {

  const [category, setCategory] = useState("");
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const todoListStructure = {
    text: '',
    working: working,
    done: false,
    isEditing: false
  }
  const [todoList, setTodoList] = useState({...todoListStructure});

  const travel = async () => {
    setWorking(false);
    await saveCategory('travel');
  }
  const work = async () => {
    setWorking(true);
    await saveCategory('work');

  }
  const onChangeText = (payload) => setText(payload);

  const saveCategory = async (category) => {
    try {
      await AsyncStorage.setItem(STORAGE_CATEGORY, JSON.stringify(category));
    } catch (e) {
      console.error(e)
    }
  }

  const loadCategory = async () => {
    try {
      const storedCategory = await AsyncStorage.getItem(STORAGE_CATEGORY);
      const category = JSON.parse(storedCategory);
      setCategory(category);
      setWorking(category === 'work')
    } catch (e) {
      console.error(e)
    }
  }

  const saveTodo = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch (e) {
      console.error(e)
    }
  }

  const loadTodo = async (loadedCategory = category) => {
    try {
      const item = await AsyncStorage.getItem(STORAGE_KEY);
      let todos = JSON.parse(item) || {};
      setTodoList(todos)
    } catch (e) {
      console.error(e)
    }
  }

  const addTodo = async () => {
    try {
      if (text === "") return;
      const newTodo = {...todoList, [Date.now()]: {...todoListStructure}};
      setTodoList(newTodo);
      await saveTodo(newTodo)
      setText("");
    } catch (e) {
      console.error(e)
    }
  }

  const onDelete = (key) => {
    try {
      Alert.alert("Delete Todo", "Are you sure delete this?", [
        {text: "Cancel"},
        {
          text: "I'm sure",
          style: "destructive",
          onPress: () => {
            const newTodoList = {...todoList};
            delete newTodoList[key];
            setTodoList(newTodoList);
            saveTodo(newTodoList);
          }
        }
      ])
      return;
    } catch (e) {
      console.error(e)
    }
  }

  const onToggleDone = async (key) => {
    try {
      const nowDoneState = todoList[key]['done'];
      const done = nowDoneState ? false : true;
      const updatedTodo = {...todoList, [key]: {...todoList[key], done: done}};
      setTodoList(updatedTodo);
      await saveTodo(updatedTodo);
    } catch (e) {
      console.error(e)
    }
  }

  const onEditTodo = async (key, newText) => {
    try {
      const updatedTodo = {...todoList, [key]: {...todoList[key], text: newText, isEditing: false}}
      setTodoList(updatedTodo);
      await saveTodo(updatedTodo);
    } catch (e) {
      console.error(e)
    }
  }

  const onToggleEdit = async (key) => {
    try {
      const currentEditStatus = todoList[key].isEditing;
      const isEditing = currentEditStatus ? false : true;
      const updatedTodo = {...todoList, [key]: {...todoList[key], isEditing: isEditing}};
      setTodoList(updatedTodo);
      await saveTodo(updatedTodo);
    } catch (e) {
      console.error(e)
    }
  }

  const TodoItems = React.memo(({itemKey, todo, onToggleDone, onDelete, onEditTodo}) => {
      const [editText, setEditText] = useState(todo.text);
      return (
        <View style={styles.toDo}>
          <TouchableOpacity onPress={() => onToggleDone(itemKey)}>
            <AntDesign
              name={todo.done ? "checksquare" : "checksquareo"}
              size={24}
              color="black"
            />
          </TouchableOpacity>

          {todo.isEditing ? (
            <View>
              <TextInput
              value={editText}
              onChangeText={setEditText}
              style={styles.input}
              onSubmitEditing={() => onEditTodo(itemKey,editText)}
              />
            </View>
          ) : (<Text style={styles.toDoText}>{todo.text}</Text>)}

          <TouchableOpacity onPress={() => onToggleEdit(itemKey)}>
            <AntDesign name="edit" size={24} color="black"/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(itemKey)}>
            <Fontisto name="trash" size={18} color={theme.grey}/>
          </TouchableOpacity>
        </View>
      )
    }
  );

  useEffect(() => {
    loadCategory();
  }, []);

  useEffect(() => {
    loadTodo()
  }, [category]) // category 상태가 변경될 때 마다 loadTodo 호출

  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: working ? theme.grey : "white"}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addTodo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        style={styles.input}
        placeholder={working ? "ADD a TO Do" : "Where do you want to go"}/>
      <ScrollView>
        {Object.keys(todoList)
          .filter((key) => todoList[key].working === working)
          .map((key) => (
            <TodoItems key={key} itemKey={key} todo={todoList[key]} onToggleDone={onToggleDone} onDelete={onDelete}
                       onEditTodo={onEditTodo}/>
          ))
        }
      </ScrollView>
    </View>
  );
}


