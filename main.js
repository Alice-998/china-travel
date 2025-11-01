const items = document.querySelectorAll('.item');

items.forEach(item => {
  item.addEventListener('click', () => {
    const province = item.dataset.province;
    window.location.href = `map.html?province=${province}`;
  });
});
