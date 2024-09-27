(async () => {
  const likeCount = await new Promise((resolve) => {
    chrome.storage.local.get('likeCount', (result) => {
      resolve(result.likeCount || 0);
    });
  });

  const commentCount = await new Promise((resolve) => {
    chrome.storage.local.get('commentCount', (result) => {
      resolve(result.commentCount || 0);
    });
  });

  console.log(`Will like ${likeCount} posts and comment on ${commentCount} posts.`);

  // Helper function to wait for elements
  const waitForElement = async (selector, timeout = 50000) => { // Increased timeout to 50 seconds
    return new Promise((resolve, reject) => {
      const interval = 100;
      let timeSpent = 0;

      const checkElement = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(checkElement);
          resolve(element);
        } else if (timeSpent > timeout) {
          clearInterval(checkElement);
          reject(`Element ${selector} not found within ${timeout} ms`);
        }
        timeSpent += interval;
      }, interval);
    });
  };

  // Function to like posts
  const likePosts = async (count) => {
    let totalLiked = 0;

    const likeButtons = Array.from(document.querySelectorAll('button[aria-label*="Like"][aria-pressed="false"]'));

    if (likeButtons.length === 0) {
      console.error('No like buttons found on currently loaded posts.');
      return;
    }

    for (let i = 0; i < likeButtons.length && totalLiked < count; i++) {
      setTimeout(() => {
        likeButtons[i].click();
        console.log(`Post ${totalLiked + 1} liked!`);
        totalLiked++;
      }, i * 2000); 
    }
  };

  // Function to comment on posts
  const commentPosts = async (count) => {
    let totalCommented = 0;

    const commentButtons = Array.from(document.querySelectorAll('button[aria-label*="Comment"]'));

    if (commentButtons.length === 0) {
      console.error('No comment buttons found on currently loaded posts.');
      return;
    }

    for (let i = 0; i < commentButtons.length && totalCommented < count; i++) {
      setTimeout(async () => {
        commentButtons[i].click(); // Click to open the comment section
        console.log(`Opened comment section for post ${totalCommented + 1}`);

        try {
          // Wait for the comment input to appear
          const commentInput = await waitForElement('div[role="textbox"]');
          
          const commentText = 'CFBR'; // Comment text
          commentInput.innerText = commentText; // Set comment text

          const inputEvent = new Event('input', { bubbles: true });
          commentInput.dispatchEvent(inputEvent); // Dispatch input event to simulate typing

          // Wait for the post "Comment" button to appear (after entering the text)
          const postButton = await waitForElement('button.artdeco-button--primary'); // This button should appear after entering a comment

          // Click the "Comment" button to submit the comment
          postButton.click();
          console.log(`Comment posted on post ${totalCommented + 1}`);
          totalCommented++;
        } catch (error) {
          console.error(`Error commenting on post ${totalCommented + 1}: ${error.message}`);
        }
      }, i * 5000); // Delay to simulate human behavior
    }
  };

  // Perform the actions
  if (likeCount > 0) await likePosts(likeCount);
  if (commentCount > 0) await commentPosts(commentCount);
})();
