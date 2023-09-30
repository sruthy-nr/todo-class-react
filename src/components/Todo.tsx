import React, { Component, ChangeEvent } from 'react';
import './style.css';
import axios from 'axios';

interface Todo {
  id: number;
  text: string;
  fromtime: string;
  totime: string;
  date: string;
  completed: boolean;
}

interface TodoAppState {
  todos: Todo[];
  inputText: string;
  inputFromTime: string;
  inputToTime: string;
  inputDate: string;
  editText: string;
  editFromTime: string;
  editToTime: string;
  editingId: number | null;
  editDate: string;
  filterDate: string;
}

class TodoApp extends Component<{}, TodoAppState> {
  state: TodoAppState = {
    todos: [],
    inputText: '',
    inputFromTime: '',
    inputToTime: '',
    inputDate: '',
    editText: '',
    editFromTime: '',
    editToTime: '',
    editingId: null,
    editDate: '',
    filterDate: '',
  };

  componentDidMount() {
    this.fetchData();
  }

  // componentDidUpdate(prevProps: any, prevState: TodoAppState) {
  //   // Compare the 'todos' from previous state with current state
  //   if (this.state.filterDate === prevState.filterDate) {
  //     this.fetchData();
  //   }
  // }

  fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/");
      this.setState({ todos: response.data });
      console.log(response.data);
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error creating ToDo item:', error.message);
      } else {
        console.log('An unknown error occurred:', error);
      }    }
  };

  addTodo = async () => {
    const {
      inputText,
      inputFromTime,
      inputToTime,
      inputDate,
      todos,
    } = this.state;

    if (
      inputText.trim() === '' ||
      inputFromTime.trim() === '' ||
      inputToTime.trim() === '' ||
      inputDate.trim() === ''
    ) {
      return;
    }

    const newTodo: Todo = {
      id: todos.length + 1,
      text: inputText,
      fromtime: inputFromTime,
      totime: inputToTime,
      date: inputDate,
      completed: false,
    };

    try {
      const response = await axios.post("http://localhost:5001/api", newTodo);
      console.log('New ToDo item created:', response.data);
      // this.setState({ todos: response.data, inputText: '' });//before db connection
      this.fetchData();//other method componentDidUpdate
       this.setState({inputText:'',inputFromTime:'',inputToTime:''})
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error creating ToDo item:', error.message);
      } else {
        console.log('An unknown error occurred:', error);
      }    }
  };

  toggleTodo = async (id: number) => {
    try {
      await axios.patch(`http://localhost:5001/api/${id}`);
      this.fetchData();
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error creating ToDo item:', error.message);
      } else {
        console.log('An unknown error occurred:', error);
      }    }
  };

  startEditing = (id: number, text: string, fromtime: string, totime: string, date: string) => {
    this.setState({
      editingId: id,
      editText: text,
      editFromTime: fromtime,
      editToTime: totime,
      editDate: date,
    });
  };

  saveEditing = async (id: number) => {
    const { editText, editFromTime, editToTime, editDate } = this.state;

    const editTodo: Todo = {
      id,
      text: editText,
      fromtime: editFromTime,
      totime: editToTime,
      date: editDate,
      completed: false,
    };

    try {
      await axios.put(`http://localhost:5001/api/${id}`, editTodo);
      this.fetchData();
      this.setState({ editingId: null });
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error creating ToDo item:', error.message);
      } else {
        console.log('An unknown error occurred:', error);
      }    }
  };

  cancelEditing = () => {
    this.setState({ editingId: null });
  };

  handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filterDate = e.target.value;
    this.setState({ filterDate, inputDate: filterDate });
  };

  render() {
    const {
      todos,
      inputText,
      inputFromTime,
      inputToTime,
      // inputDate,
      editText,
      editFromTime,
      editToTime,
      editingId,
      editDate,
      filterDate,
    } = this.state;

    const today = new Date().toISOString().split('T')[0];
    const filteredTodos = filterDate
      ? todos.filter((todo) => todo.date === filterDate)
      : [];

    return (
      <div>
        <div>
          <h1>Todo App</h1>
          <div>
            DATE:
            <input
              type="date"
              min={today}
              value={filterDate}
              onChange={this.handleFilterChange}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <input
              type="text"
              placeholder="Add a todo"
              value={inputText}
              onChange={(e) => this.setState({ inputText: e.target.value })}
            />
            <br /><br />
            FROM:<input
              type="time"
              value={inputFromTime}
              onChange={(e) => this.setState({ inputFromTime: e.target.value })}
            />&nbsp;&nbsp;&nbsp;&nbsp;
            TO:<input
              type="time"
              value={inputToTime}
              onChange={(e) => this.setState({ inputToTime: e.target.value })}
            />&nbsp;&nbsp;&nbsp;&nbsp; <br /><br />
            <button onClick={this.addTodo} className='button'>Add</button>
          </div>
        </div>
        <div className='xyz'>
          {filteredTodos.map((todo) => (
            <span key={todo.id}>
              {editingId === todo.id ? (
                <div>
                  <div className="card">
                    <div className="container">
                      <br />
                      <input
                        type="date"
                        min={editDate}
                        value={editDate}
                        onChange={(e) => this.setState({ editDate: e.target.value })}
                      /> <br /><br />
                      Task: <input
                        type="text"
                        value={editText}
                        onChange={(e) => this.setState({ editText: e.target.value })}
                      /> <br /><br />
                      From: <input
                        type="time"
                        value={editFromTime}
                        onChange={(e) => this.setState({ editFromTime: e.target.value })}
                      />&nbsp;&nbsp;
                      To: <input
                        type="time"
                        value={editToTime}
                        onChange={(e) => this.setState({ editToTime: e.target.value })}
                      />
                      <br /><br /><br />
                      <button onClick={() => this.saveEditing(todo.id)} className='button'>Save</button>&nbsp;&nbsp;
                      <button onClick={this.cancelEditing} className='button'>Cancel</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="card">
                    <div className="container">
                      {todo.date}
                      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                        <h4><b>Task:  {todo.text}</b>
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => this.toggleTodo(todo.id)}
                          />
                        </h4>
                        <p>Time: {todo.fromtime} - {todo.totime}</p>
                      </span>
                    </div>
                    {!todo.completed && <button className='button' onClick={() => this.startEditing(todo.id, todo.text, todo.fromtime, todo.totime, todo.date)}>Edit</button>}
                    {todo.completed && <b className='done'>DONE</b>}
                  </div>
                </div>
              )}
            </span>
          ))}
        </div>
      </div>
    );
  }
}

export default TodoApp;

