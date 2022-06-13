import Constants from './popupConstants.js'

export const copy = (s) => navigator.clipboard.writeText(s)
export const now = () => new Date().toISOString()

export const scrapeData = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return await chrome.tabs.sendMessage(tab.id, { method: "scrapePage" });
}

export const CONNECTION_REQUEST_TYPE = 'CONNECTION_REQUEST_TYPE'
export const POST_CONNECTION_TYPE = 'POST_CONNECTION_TYPE'
export const RECRUITER = 'RECRUITER'
export const SOFTWARE_ENGINEER = 'SOFTWARE_ENGINEER'


const getTemplate = (target, type) => {
  if (target == RECRUITER) {
    if (type == CONNECTION_REQUEST_TYPE) {
      return Constants.RECRUITER_CONNECTION_REQUEST_MESSAGE_TEMPLATE
    }
    if (type == POST_CONNECTION_TYPE) {
      return Constants.RECRUITER_POST_CONNECTION_MESSAGE_TEMPLATE
    }
  }
  if (target == SOFTWARE_ENGINEER) {
    if (type == CONNECTION_REQUEST_TYPE) {
      return null
    }
    if (type == POST_CONNECTION_TYPE) {
      return null
    }
  }
}


export const buildMessage = (target, type, params) => {
  const template = getTemplate(target, type)
  return template
    .replaceAll('{fname}', params?.fname)
    .replaceAll('{company}', params?.company)
    .replaceAll('{my_fname}', Constants.MY_FNAME)
    .replaceAll('{my_name}', Constants.MY_NAME)
    .replaceAll('{my_tel}', Constants.MY_TEL)
    .replaceAll('{my_email}', Constants.MY_EMAIL)
    .replaceAll('{my_position}', Constants.MY_POSITION)
}