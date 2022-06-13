const scrapePage = () => ({
  linkedin_url: window.location.href,
  username: window.location.href.split('?')?.at(0)?.split('linkedin.com/in/')?.at(1)?.replace('/', ''),
  name: document.querySelector('h1')?.innerText,
  headline: document.querySelector('h1')?.parentElement?.nextElementSibling?.innerText,
  company: document.querySelector('a[href="#experience"]')?.innerText
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.method == 'scrapeData') {
      sendResponse(scrapePage())
    }
  }
);