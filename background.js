
// Function to execute the whole process
function executeScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[0].id, { url: 'https://www.drakons.io/battle' }, (tab) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === tab.id && changeInfo.status === 'complete') {
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              function: waitForImageAndClick
            });
            chrome.tabs.onUpdated.removeListener(listener);
          }
        });
      });
    });
  
    function waitForImageAndClick() {
      function clickImage() {
        const divs = document.querySelectorAll('._3h-UINLQJpiyToPQuDbXiL._3biUgzO4Xw_UFNpbhRQ7_x');
        if (divs.length >= 4) {
          const fourthDivImage = divs[3].querySelector('.ui.tiny.image'); // Select the image inside the fourth div
          if (fourthDivImage) {
            fourthDivImage.click();
            console.log('Fourth div image clicked');
  
            // After clicking the fourth div image, click the first div
            const firstDiv = divs[0];
            if (firstDiv) {
              setTimeout(() => {
                firstDiv.click();
                console.log('First div clicked');
                // After clicking the first div, click the ranked game mode selector
                setTimeout(() => {
                  const rankedGameMode = document.querySelector('div._1aG9H0KyEHbmUYp0QL-tvI > img[alt="ranked game mode"]');
                  if (rankedGameMode) {
                    rankedGameMode.click();
                    console.log('Ranked game mode clicked');
  
                    // After clicking the ranked game mode, click the "Send" button at index 1
                    setTimeout(() => {
                      const sendButtons = document.querySelectorAll('button.ui.primary.button._3gS5XYgP7RbTTAMBksUWsb[role="button"]');
                      if (sendButtons.length > 1) {
                        sendButtons[1].scrollIntoView(); // Ensure the button is in view
                        sendButtons[1].click();
                        console.log('Send button clicked');
  
                        // After clicking the "Send" button, click the "Close" button
                        setTimeout(() => {
                          const buttons = document.querySelectorAll('button.ui.primary.button._3gS5XYgP7RbTTAMBksUWsb[role="button"]');
                          let closeButton = null;
                          buttons.forEach(button => {
                            if (button.textContent.trim() === 'Close') {
                              closeButton = button;
                            }
                          });
                          if (closeButton) {
                            closeButton.scrollIntoView(); // Ensure the button is in view
                            closeButton.click();
                            console.log('Close button clicked');
                          } else {
                            console.log('Close button not found');
                          }
                        }, 10000); // Adding a delay of 1 second to ensure the previous click completes
                      } else {
                        console.log('Send button not found');
                      }
                    }, 10000); // Adding a delay of 1 second to ensure the previous click completes
                  } else {
                    console.log('Ranked game mode image not found');
                  }
                }, 10000); // Adding a delay of 1 second to ensure the previous click completes
              }, 10000); // Adding a delay of 1 second to ensure the previous click completes
            } else {
              console.log('First div not found');
            }
          } else {
            console.log('Image not found inside the fourth div');
          }
        } else {
          console.log('Less than 4 divs found, retrying...');
          setTimeout(clickImage, 10000); // Retry every 10 seconds
        }
      }
      clickImage();
    }
}
  
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'stop') {
    chrome.alarms.clear('drakonsAlarm', (wasCleared) => {
      if (wasCleared) {
        console.log('Drakons script stopped');
      } else {
        console.log('Failed to stop the Drakons script');
      }
    });
  } else if (request.action === 'start') {
    chrome.alarms.clear('drakonsAlarm'); // Clear any existing alarms
    chrome.alarms.create('drakonsAlarm', { periodInMinutes: request.minutes });
    console.log(`Drakons script started with a period of ${request.minutes} minutes`);
  }
});
  
// Create an alarm that triggers every 5 minutes
// chrome.alarms.create('drakonsAlarm', { periodInMinutes: 60 });

// // Create an alarm when the start button is clicked
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'stop') {
//       chrome.alarms.clear('drakonsAlarm', (wasCleared) => {
//         if (wasCleared) {
//           console.log('Drakons script stopped');
//         } else {
//           console.log('Failed to stop the Drakons script');
//         }
//       });
//     }
// });
  
// Listen for the alarm event
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'drakonsAlarm') {
      executeScript();
  }
});
  


