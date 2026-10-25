(function () {
  'use strict';

  var STORAGE_KEY = 'todo-app.todos';

  var form = document.getElementById('todo-form');
  var input = document.getElementById('todo-input');
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
        return { text: todo.text, done: todo.done === true };
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

    var remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'todo-delete';
    remove.textContent = '削除';
    remove.setAttribute('aria-label', '「' + todo.text + '」を削除');

    checkbox.addEventListener('change', function () {
      todo.done = checkbox.checked;
      item.classList.toggle('done', todo.done);
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
    item.appendChild(remove);
    list.appendChild(item);
  }

  function addTodo(text) {
    var todo = { text: text, done: false };
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
    addTodo(text);
    input.value = '';
    input.focus();
  });
})();
