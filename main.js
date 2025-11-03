const items = document.querySelectorAll('.item');

items.forEach(item => {
  item.addEventListener('click', () => {
    window.location.href = 'map.html';
  });
});