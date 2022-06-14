import { MyInformation } from './popupConstants.js'

export const copy = (s) => navigator.clipboard.writeText(s)

export const now = () => new Date().toISOString()

export const getCurrentTab = async () => chrome.tabs.query({ active: true, currentWindow: true})

export const sendMessageToTab = async (tabId, message, callback=null) => chrome.tabs.sendMessage(tabId, message, callback)

export const scrapeData = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return await chrome.tabs.sendMessage(tab.id, { method: "scrapePage" });
}

export const formatTemplate = (template, params) => {
  return template
    .replaceAll('{fname}', params?.first_name)
    .replaceAll('{company}', params?.company)
    .replaceAll('{my_fname}', MyInformation.FirstName)
    .replaceAll('{my_name}', MyInformation.FullName)
    .replaceAll('{my_tel}', MyInformation.Telephone)
    .replaceAll('{my_email}', MyInformation.Email)
    .replaceAll('{my_position}', MyInformation.Position)
}

export const similarity = (s1, s2) => {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

const editDistance = (s1, s2) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}