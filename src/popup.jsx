import React, { useEffect, useState } from "react"
import { copy, formatTemplate, getCurrentTab, sendMessageToTab } from "./popupService"
import { render } from "react-dom"
import { MessageTemplates } from "./popupConstants.js"
import { getRecruiterExists, getTouchpointsData, postRecruiter, putTouchpointsData } from "./popupHttpServices.js"
import { TextInput } from "./Input.jsx"
import { Checkbox } from "./Checkbox.jsx"
import { camelToHuman } from "./utils"


const Popup = () => {

  const [profileData, setProfileData] = useState({})
  const [touchpointsData, setTouchPointsData] = useState({})
  const [message, setMessage] = useState('')

  const init = async () => {
    try {
      const [tab] = await getCurrentTab()
      const tempProfileData = await sendMessageToTab(tab.id, {method: 'scrapeData'})
      tempProfileData.fname = tempProfileData?.name?.split(' ').at(0)
      setProfileData(tempProfileData)
      const recruiterExists = await getRecruiterExists(tempProfileData.username).then(r => r.json())
      if (recruiterExists) {
        setTouchPointsData(await getTouchpointsData(tempProfileData.username).then(r => r.json()))
      } else {
        await postRecruiter({
          username: profileData.username,
          profile: profileData,
          touchpoints: touchpointsData
        })
      }
      setProfileData(tempProfileData)
    } catch (err) {
      console.log(err)
    }
  }

  const loadMessage = async (template) => {
    const message = formatTemplate(template, profileData)
    setMessage(message)
    copy(message)
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
          {Object.keys(touchpointsData).map(key => (
            <Checkbox
              label={camelToHuman(key)}
              id={key}
              value={touchpointsData[key]?.value}
              onChange={handleTouchpointsInputsChange}
            />
          ))}
        </div>
        <button onClick={() => putTouchpointsData(profileData.username, touchpointsData)}>Update Touchpoints</button>
      </div>
      <div>
        <h3 style={{ marginBlockStart: '0px', marginBlockEnd: '10px' }}>Profile</h3>
        <div style={{ display: 'grid', rowGap: '5px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '10px' }}>
            <TextInput label='Name' id='name' value={profileData?.name} onChange={handleProfileInputChange} />
            <TextInput label='Company' id='company' value={profileData?.company} onChange={handleProfileInputChange} />
          </div>
          <TextInput label='Headline' id='headline' value={profileData?.headline} onChange={handleProfileInputChange} />
          <label>Message
            <textarea rows='10' value={message} onChange={(e) => setMessage(e.target.value)} style={{ fontFamily: 'inherit', width: 'calc(100% - 8px)', fontSize: '11px', padding: '3px', resize: 'vertical' }} /></label>
        </div>
        <div>
          <h3 style={{ marginBlockStart: '10px', marginBlockEnd: '10px' }}>Generate & Copy Messages</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '5px', columnGap: '5px', paddingBottom: '10px' }}>
            <button onClick={() => loadMessage(MessageTemplates.RecruiterConnectionRequest)} style={{fontSize: '12px'}}>First Connection - RECR</button>
            <button onClick={() => loadMessage(MessageTemplates.RecruiterPostConnection)} style={{fontSize: '12px'}}>Post Connection - RECR</button>
            <button onClick={() => loadMessage(MessageTemplates.SoftwareEngineerConnectionRequest)} style={{fontSize: '12px'}}>First Connection - SFWE</button>
            <button onClick={() => loadMessage(MessageTemplates.SoftwareEngineerPostConnection)} style={{fontSize: '12px'}}>Post Connection - SFWE</button>
          </div>
          <button onClick={init}>Load Page Content</button>
        </div>
      </div>
    </div>
  )
}

render(<Popup />, document.getElementById('root'))
