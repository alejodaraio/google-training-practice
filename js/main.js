window.addEventListener('offline', event => {
  document.querySelector('body').classList.add('offline');
});

window.addEventListener('online', event => {
  document.querySelector('body').classList.remove('offline');
});