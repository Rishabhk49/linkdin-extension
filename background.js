// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'startScraping') {
//     // Hardcoded LinkedIn profile links (at least 3 links)
//     const profileLinks = [
//       "https://www.linkedin.com/in/ashish-tiwari-390714277/",
//       "https://www.linkedin.com/in/mitanshi-b297a116a/",
//       "https://www.linkedin.com/in/sradvpradeeprai/"
//     ];

//     profileLinks.forEach((link, index) => {
//       setTimeout(() => {
//         // Open each LinkedIn profile in a new tab (in background)
//         chrome.tabs.create({ url: link, active: false }, (tab) => {
//           // Inject the content script into the opened LinkedIn profile page
//           chrome.scripting.executeScript({
//             target: { tabId: tab.id },
//             files: ['contentScript.js']
//           }, (results) => {
//             // After scraping, send the scraped data to the backend
//             const profileData = results[0].result;
//             fetch('http://127.0.0.1:3000/api/profile', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify(profileData)
//             })
//               .then(response => response.json())
//               .then(result => console.log('Profile saved:', result))
//               .catch(error => console.error('Error saving profile:', error));
//           });
//         });
//       }, index * 5000); // Delay between opening profiles to avoid overwhelming the browser
//     });

//     sendResponse({ status: 'Scraping started' });
//   }
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startAutomation') {
    chrome.tabs.create({ url: 'https://www.linkedin.com/feed/', active: true }, (tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['contentScript.js'] // Inject script to like and comment on posts
      });
    });
    sendResponse({ status: 'Automation started' });
    return true;
  }
});


// This function will be injected into the LinkedIn feed page
function startLinkedInAutomation(likeCount, commentCount) {
  // Helper to randomly select posts
  const getRandomPosts = (posts, count) => {
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Like posts
  const likePosts = (count) => {
    // Find the like buttons by the correct label or class
    const posts = document.querySelectorAll('button[aria-label*="Like"][aria-pressed="false"]'); // Find "unliked" posts
    const randomPostsToLike = getRandomPosts(posts, count);
    randomPostsToLike.forEach((post, index) => {
      setTimeout(() => post.click(), index * 2000); // Add delay for each like action
    });
  };

  // Comment on posts
  const commentOnPosts = (count) => {
    // Find the comment buttons for posts
    const commentButtons = document.querySelectorAll('button[aria-label*="Comment"]');
    const randomPostsToComment = getRandomPosts(commentButtons, count);

    randomPostsToComment.forEach((commentButton, index) => {
      setTimeout(() => {
        commentButton.click(); // Open the comment box

        setTimeout(() => {
          const commentBox = document.querySelector('textarea[aria-label="Add a comment"]');
          if (commentBox) {
            commentBox.value = 'CFBR'; // Set the comment text
            commentBox.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event for React to pick it up

            // Click the Post button after adding the comment
            const postButton = document.querySelector('button[aria-label="Post"]');
            postButton && postButton.click();
          }
        }, 3000); // Wait 3 seconds to ensure the comment box is open
      }, index * 5000); // Add delay between comments
    });
  };

  // Execute automation for likes and comments
  likePosts(likeCount);
  commentOnPosts(commentCount);
}



