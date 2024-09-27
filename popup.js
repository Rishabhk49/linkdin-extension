// document.getElementById('startScraping').addEventListener('click', () => {
//   console.log('Start Scraping button clicked');
//   chrome.runtime.sendMessage({ action: 'startScraping' }, (response) => {
//     if (chrome.runtime.lastError) {
//       console.error(chrome.runtime.lastError.message);
//     } else {
//       console.log(response.status);
//       document.getElementById('status').innerText = response.status;
//     }
//   });
// });
document.addEventListener('DOMContentLoaded', () => {
  const likeCountInput = document.getElementById('likeCount');
  const commentCountInput = document.getElementById('commentCount');
  const startButton = document.getElementById('startAutomation');

  // Function to check if both fields have valid input
  const validateInputs = () => {
    const likeCount = parseInt(likeCountInput.value, 10);
    const commentCount = parseInt(commentCountInput.value, 10);

    if (!isNaN(likeCount) && likeCount > 0 && !isNaN(commentCount) && commentCount > 0) {
      startButton.disabled = false;
    } else {
      startButton.disabled = true;
    }
  };

  likeCountInput.addEventListener('input', validateInputs);
  commentCountInput.addEventListener('input', validateInputs);

  // Initially disable the button
  startButton.disabled = true;

  // Handle button click event
  startButton.addEventListener('click', () => {
    const likeCount = parseInt(likeCountInput.value, 10);
    const commentCount = parseInt(commentCountInput.value, 10);

    if (!isNaN(likeCount) && likeCount > 0 && !isNaN(commentCount) && commentCount > 0) {
      // Save the like and comment counts in chrome storage
      chrome.storage.local.set({ likeCount, commentCount }, () => {
        chrome.runtime.sendMessage({ action: 'startAutomation' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            console.log(response.status);
          }
        });
      });
    }
  });
});
