(function () {
  'use strict';

  var form = document.getElementById('todo-form');
  var input = document.getElementById('todo-input');
  var list = document.getElementById('todo-list');

  function addTodo(text) {
    var item = document.createElement('li');

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-check';
    checkbox.setAttribute('aria-label', '完了にする');

    var label = document.createElement('span');
    label.className = 'todo-text';
    label.textContent = text;

    var remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'todo-delete';
    remove.textContent = '削除';
    remove.setAttribute('aria-label', '「' + text + '」を削除');

    checkbox.addEventListener('change', function () {
      item.classList.toggle('done', checkbox.checked);
    });

    remove.addEventListener('click', function () {
      list.removeChild(item);
      input.focus();
    });

    item.appendChild(checkbox);
    item.appendChild(label);
    item.appendChild(remove);
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
