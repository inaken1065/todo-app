(function () {
  'use strict';

  var form = document.getElementById('todo-form');
  var input = document.getElementById('todo-input');
  var list = document.getElementById('todo-list');

  function addTodo(text) {
    var item = document.createElement('li');
    item.textContent = text;
    list.appendChild(item);
  }

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
