const ChuckMessage = async () => {

  try {
    const response = await fetch('https://api.chucknorris.io/jokes/random');
    const message = await response.json();
    return message.value;
  }
  catch (error) {
    return "Chuck is offline, sry.";
  }
};

const renderChuckMessage = () => {
  ChuckMessage().then(message => {
    document.querySelector('#random-message').innerHTML = message;
  });
};

const renderChuckOfflineMessage = () => {
  document.querySelector('#random-message').innerHTML = 'Chuck is offline, sry.';
};

window.addEventListener('offline', event => {
  renderChuckOfflineMessage();
});

window.addEventListener('online', event => {
  renderChuckMessage();
});

// init first message.
renderChuckMessage();