import React, { useEffect, useState } from "react"
import {
  scrapeData,
  buildMessage,
  POST_CONNECTION_TYPE,
  CONNECTION_REQUEST_TYPE,
  RECRUITER,
  SOFTWARE_ENGINEER,
  copy
} from "./popupService"
import { render } from "react-dom"


const Popup = () => {

  const [appData, setAppData] = useState({})
  const [profileData, setProfileData] = useState({})
  const [touchpointsData, setTouchPointsData] = useState({})
  const [message, setMessage] = useState('')

  const init = async () => {
    const username = await loadData()
    doesProfileExist(username)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw Error(`Oops! ${response.statusText}`)
      })
      .then((doesExist) => {
        if (doesExist) {
          getTouchpointsData(username)
            .then((response) => {
              if (response.ok) {
                return response.json()
              }
              throw Error(`Oops! ${response.statusText}`)
            })
            .then((data) => {
              setTouchPointsData(data)
            })
        } else {
          createProfile()
        }
      })
  }

  const sendRequest = async (method, route, body) => {
    const configs = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(body)
    }
    return fetch('http://localhost:8082' + route, configs)
  }

  const getTouchpointsData = (username=null) => sendRequest('GET', `/recruiters/${username || profileData.username}/touchpoints`)

  const putTouchpointsData = () => sendRequest('PUT', `/recruiters/${profileData.username}/touchpoints`, touchpointsData)

  const createProfile = () => sendRequest('POST', '/recruiters', { username: profileData.username, profile: profileData, touchpoints: touchpointsData })

  const doesProfileExist = (username=null) => sendRequest('GET', `/recruiters/${username || profileData.username}/exists`)

  const loadMessage = (target, type) => {
    const message = buildMessage(target, type, profileData)
    setMessage(message)
    copy(message)
  }

  const loadData = async () => {
    let username;
    await scrapeData()
      .then((res) => {
        console.log('message', res)
        username = res.username
        setProfileData((prev) => ({
          ...prev,
          company: res?.company,
          headline: res?.headline,
          name: res?.name,
          username: res?.username,
          linkedin_url: res?.linkedin_url,
          fname: res?.name?.split(' ')?.at(0)
        }))
        console.log('done', res)
      })
    return username
  }

  const handleTouchpointsInputsChange = (e) => {
    const { id, checked } = e.target
    setTouchPointsData((prev) => ({ ...prev, [id]: { value: checked } }))
  }

  const handleProfileInputChange = (e) => {
    const { id, value } = e.target
    setProfileData((prev) => ({ ...prev, [id]: value }))
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div style={{
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: '2fr 3fr',
      width: '640px'
    }}>
      <div>
        <h3 style={{ marginBlockStart: '0px', marginBlockEnd: '10px' }}>Touchpoints</h3>
        <div style={{ paddingBottom: '15px' }}>
          <label onChange={handleTouchpointsInputsChange} style={{ display: 'block' }}><input checked={touchpointsData?.connectionRequestSent?.value} id='connectionRequestSent' type="checkbox" />Connection Request Sent</label>
          <label onChange={handleTouchpointsInputsChange} style={{ display: 'block' }}><input checked={touchpointsData?.connectionRequestAccepted?.value} id='connectionRequestAccepted' type="checkbox" />Connection Request Accepted</label>
          <label onChange={handleTouchpointsInputsChange} style={{ display: 'block' }}><input checked={touchpointsData?.thankYouMessageAndResumeSent?.value} id='thankYouMessageAndResumeSent' type="checkbox" />Thank You and Resume Message Sent</label>
          <label onChange={handleTouchpointsInputsChange} style={{ display: 'block' }}><input checked={touchpointsData?.responded?.value} id='responded' type="checkbox" />Responded</label>
          <label onChange={handleTouchpointsInputsChange} style={{ display: 'block' }}><input checked={touchpointsData?.opportunitiesAvailable?.value} id='opportunitiesAvailable' type="checkbox" />Opportunities Available</label>
          <label onChange={handleTouchpointsInputsChange} style={{ display: 'block' }}><input checked={touchpointsData?.opportunitiesNotAvailable?.value} id='opportunitiesNotAvailable' type="checkbox" />Opportunities not Available</label>
          <label onChange={handleTouchpointsInputsChange} style={{ display: 'block' }}><input checked={touchpointsData?.phoneCallScheduled?.value} id='phoneCallScheduled' type="checkbox" />Phone Call Scheduled</label>
          <label onChange={handleTouchpointsInputsChange} style={{ display: 'block' }}><input checked={touchpointsData?.phoneCallOccurred?.value} id='phoneCallOccurred' type="checkbox" />Phone Call Occurred</label>
          <label onChange={handleTouchpointsInputsChange} style={{ display: 'block' }}><input checked={touchpointsData?.interviewScheduled?.value} id='interviewScheduled' type="checkbox" />Interview Scheduled</label>
          <label onChange={handleTouchpointsInputsChange} style={{ display: 'block' }}><input checked={touchpointsData?.interviewOccurred?.value} id='interviewOccurred' type="checkbox" />Interview Occurred</label>
        </div>
        <button onClick={putTouchpointsData}>Update Touchpoints</button>
      </div>
      <div>
        <h3 style={{ marginBlockStart: '0px', marginBlockEnd: '10px' }}>Profile</h3>
        <div style={{ display: 'grid', rowGap: '5px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '10px' }}>
            <label>Name
              <input type='text' id='name' value={profileData.name} onChange={handleProfileInputChange} style={{ width: 'calc(100% - 10px)', fontSize: '11px', padding: '3px' }} /></label>
            <label>Company
              <input type='text' id='company' value={profileData.company} onChange={handleProfileInputChange} style={{ width: 'calc(100% - 10px)', fontSize: '11px', padding: '3px' }} /></label>
          </div>
          <label>Headline
            <input type='text' id='headline' value={profileData.headline} onChange={handleProfileInputChange} style={{ width: 'calc(100% - 10px)', fontSize: '11px', padding: '3px' }} /></label>
          <label>Message
            <textarea rows='10' value={message} onChange={(e) => setMessage(e.target.value)} style={{ fontFamily: 'inherit', width: 'calc(100% - 8px)', fontSize: '11px', padding: '3px', resize: 'vertical' }} /></label>
        </div>
        <div>
          <h3 style={{ marginBlockStart: '10px', marginBlockEnd: '10px' }}>Generate & Copy Messages</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '5px', columnGap: '5px', paddingBottom: '10px' }}>
            <button onClick={() => loadMessage(RECRUITER, CONNECTION_REQUEST_TYPE)} style={{fontSize: '12px'}}>First Connection - RECR</button>
            <button onClick={() => loadMessage(RECRUITER, POST_CONNECTION_TYPE)} style={{fontSize: '12px'}}>Post Connection - RECR</button>
            <button onClick={() => loadMessage(SOFTWARE_ENGINEER, CONNECTION_REQUEST_TYPE)} style={{fontSize: '12px'}}>First Connection - SFWE</button>
            <button onClick={() => loadMessage(SOFTWARE_ENGINEER, POST_CONNECTION_TYPE)} style={{fontSize: '12px'}}>Post Connection - SFWE</button>
          </div>
          <button onClick={init}>Load Page Content</button>
        </div>
      </div>
    </div>
  )
}

render(<Popup />, document.getElementById('root'))
