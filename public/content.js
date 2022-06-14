const scrapePage = () => ({
  linkedin_url: window.location.href,
  username: window.location.href.split('?')?.at(0)?.split('linkedin.com/in/')?.at(1)?.replace('/', ''),
  name: document.querySelector('h1')?.innerText,
  headline: document.querySelector('h1')?.parentElement?.nextElementSibling?.innerText,
  company: document.querySelector('a[href="#experience"]')?.innerText,
  first_name: document.querySelector('h1')?.innerText?.split(' ').at(0)
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.method == 'scrapeData') {
      sendResponse(scrapePage())
    }
    if (request.method == 'navigateToURL') {
      window.location.href = request.url
    }
  }
);