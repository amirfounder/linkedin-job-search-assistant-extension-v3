const sendHttpRequest = async (method, route, body) => {
  console.log('BODY: ', body)
  return fetch('http://localhost:8082' + route, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  })
}

export const getTouchpointsData = async (username) => sendHttpRequest('GET', `/recruiters/${username}/touchpoints`)

export const putTouchpointsData = async (username, touchpoints) => sendHttpRequest('PUT', `/recruiters/${username}/touchpoints`, touchpoints)

export const getRecruiterExists = async (username) => sendHttpRequest('GET', `/recruiters/${username}/exists`)

export const postRecruiter = async (recruiter) => sendHttpRequest('POST', `/recruiters`, recruiter)

export const getTouchpointsSchemaResource = async () => sendHttpRequest('GET', '/resources/touchpoints/schema')

export const getNextCompanies = async () => sendHttpRequest('GET', `/companies/next`)
