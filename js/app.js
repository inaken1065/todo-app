(function () {
  'use strict';

  var STORAGE_KEY = 'todo-app.todos';

  var form = document.getElementById('todo-form');
  var input = document.getElementById('todo-input');
  var dueInput = document.getElementById('todo-due');
  var list = document.getElementById('todo-list');

  var todos = load();

  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!Array.isArray(data)) {
        return [];
      }
      return data.filter(function (todo) {
        return todo && typeof todo.text === 'string';
      }).map(function (todo) {
        return {
          text: todo.text,
          done: todo.done === true,
          due: typeof todo.due === 'string' ? todo.due : ''
        };
      });
    } catch (e) {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      // 保存できない環境（プライベートモードなど）でも操作は継続する
    }
  }

  function today() {
    var now = new Date();
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var day = ('0' + now.getDate()).slice(-2);
    return now.getFullYear() + '-' + month + '-' + day;
  }

  function renderTodo(todo) {
    var item = document.createElement('li');
    item.classList.toggle('done', todo.done);

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-check';
    checkbox.checked = todo.done;
    checkbox.setAttribute('aria-label', '完了にする');

    var label = document.createElement('span');
    label.className = 'todo-text';
    label.textContent = todo.text;

    var due = document.createElement('input');
    due.type = 'date';
    due.className = 'todo-due';
    due.value = todo.due;
    due.setAttribute('aria-label', '期日');

    function updateOverdue() {
      due.classList.toggle('overdue', !todo.done && todo.due !== '' && todo.due < today());
    }
    updateOverdue();

    var remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'todo-delete';
    remove.textContent = '削除';
    remove.setAttribute('aria-label', '「' + todo.text + '」を削除');

    checkbox.addEventListener('change', function () {
      todo.done = checkbox.checked;
      item.classList.toggle('done', todo.done);
      updateOverdue();
      save();
    });

    due.addEventListener('change', function () {
      todo.due = due.value;
      updateOverdue();
      save();
    });

    remove.addEventListener('click', function () {
      todos.splice(todos.indexOf(todo), 1);
      list.removeChild(item);
      save();
      input.focus();
    });

    item.appendChild(checkbox);
    item.appendChild(label);
    item.appendChild(due);
    item.appendChild(remove);
    list.appendChild(item);
  }

  function addTodo(text, dueDate) {
    var todo = { text: text, done: false, due: dueDate };
    todos.push(todo);
    renderTodo(todo);
    save();
  }

  todos.forEach(renderTodo);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var text = input.value.trim();
    if (text === '') {
      return;
    }
    addTodo(text, dueInput.value);
    input.value = '';
    dueInput.value = '';
    input.focus();
  });
})();
