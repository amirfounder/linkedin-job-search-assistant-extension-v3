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
    .replaceAll('{fname}', params?.fname)
    .replaceAll('{company}', params?.company)
    .replaceAll('{my_fname}', MyInformation.FirstName)
    .replaceAll('{my_name}', MyInformation.FullName)
    .replaceAll('{my_tel}', MyInformation.Telephone)
    .replaceAll('{my_email}', MyInformation.Email)
    .replaceAll('{my_position}', MyInformation.Position)
}