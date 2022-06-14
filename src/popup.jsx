import React, { useEffect, useState } from "react"
import { copy, formatTemplate, getCurrentTab, sendMessageToTab, similarity } from "./popupService"
import { render } from "react-dom"
import { MessageTemplates } from "./popupConstants"
import { getRecruiterExists, getTouchpointsData, postRecruiter, putTouchpointsData, getTouchpointsSchemaResource, getNextCompanies, putRecruiterProfile } from "./popupHttpServices"
import { TextInput } from "./Input.jsx"
import { Checkbox } from "./Checkbox.jsx"
import { camelToHuman } from "./utils"


const Popup = () => {
  const [profileData, setProfileData] = useState({})
  const [touchpointsData, setTouchPointsData] = useState({})
  const [message, setMessage] = useState('')
  const [nextCompanies, setNextCompanies] = useState([])
  const [potentialAliasFor, setPotentialAliasFor] = useState('')
  const [companyIsAlias, setCompanyIsAlias] = useState(false)

  const init = async () => {
    try {
      const [tab] = await getCurrentTab()
      const tempProfileData = await sendMessageToTab(tab.id, {method: 'scrapeData'})
      setProfileData(tempProfileData)
      const recruiterExists = await getRecruiterExists(tempProfileData.username).then(r => r.json())
      if (recruiterExists) {
        const touchpoints = await getTouchpointsData(tempProfileData.username).then(r => r.json())
        setTouchPointsData(touchpoints)
      } else {
        const tempTouchpointsData = await getTouchpointsSchemaResource().then(r => r.json())
        await postRecruiter({
          username: tempProfileData.username,
          profile: tempProfileData,
          touchpoints: tempTouchpointsData
        })
        setTouchPointsData(tempTouchpointsData)
      }
      const tempNextCompanies = await getNextCompanies().then(r => r.json())
      setNextCompanies(tempNextCompanies)
      setPotentialAliasFor(mostSimilarWord(tempProfileData.company, tempNextCompanies.map(x => x.name)))
    } catch (err) {
      console.log(err)
    }
  }

  const mostSimilarWord = (target, words=[], validateOnIncludes=true) => {
    let [bestWord, bestScore] = [null, -1]
    const lTarget = target.toLowerCase()
    for (const word of words) {
      const lWord = word.toLowerCase()
      if (
        validateOnIncludes && (lWord.includes(lTarget) || lTarget.includes(lWord))) {
        return word
      }
      const score = similarity(lWord, lTarget)
      if (score > bestScore) {
        bestScore = score
        bestWord = word
      }
    }
    return bestWord
  }

  const loadMessage = async (template) => {
    const message = formatTemplate(template, profileData)
    setMessage(message)
    copy(message)
  }

  const onTouchpointsCheckboxClick = (e) => {
    const { id, checked } = e.target
    setTouchPointsData((prev) => ({ ...prev, [id]: { value: checked } }))
  }

  const onProfileInputChange = (e) => {
    const { id, value } = e.target
    setProfileData((prev) => ({ ...prev, [id]: value }))
  }

  const onUpdateChangesButtonClick = async () => {
    await putTouchpointsData(profileData.username, touchpointsData)
    const tempNextCompanies = await getNextCompanies().then(r => r.json())
    setNextCompanies(tempNextCompanies)
    setPotentialAliasFor(mostSimilarWord(profileData.company, tempNextCompanies.map(x => x.name)))
  }

  useEffect(() => { init() }, [])

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
          {Object.entries(touchpointsData).map(([key, value]) => (
            <Checkbox
              label={camelToHuman(key)}
              id={key}
              value={value?.value}
              onChange={onTouchpointsCheckboxClick}
            />
          ))}
        </div>
        <button onClick={onUpdateChangesButtonClick}>Update Touchpoints</button>
        <div>
          <h3>Queued Companies</h3>
          <div>
            {nextCompanies.map((company) => (
              <div style={{paddingBottom: '5px'}}>
                <button style={{padding: '2px'}} onClick={async (e) => {
                  const [tab] = await getCurrentTab()
                  sendMessageToTab(tab.id, {
                    method: 'navigateToURL',
                    url: `https://www.linkedin.com/search/results/all/?keywords=${e.target.innerText.toLowerCase().replaceAll(' ', '%20')}%20technical%20recruiter`
                  })
                }}>
                  {company.name}
                </button>
              </div>
            ))}
          </div>
          <button></button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBlockStart: '0px', marginBlockEnd: '10px' }}>Profile</h3>
        <div style={{ display: 'grid', rowGap: '5px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '10px' }}>
            <TextInput label='Name' id='name' value={profileData?.name} onChange={onProfileInputChange} />
            <TextInput label='Company' id='company' value={profileData?.company} onChange={onProfileInputChange} />
          </div>
          <TextInput label='Headline' id='headline' value={profileData?.headline} onChange={onProfileInputChange} />
          <TextInput label='Potential Alias For...' id='alias_for' value={potentialAliasFor} disabled />
          <Checkbox label='Company is Alias' id='companyIsAlias' value={companyIsAlias} onChange={(e) => setCompanyIsAlias(!!e.target.checked)} />
          <label>Message
            <textarea rows='10' value={message} onChange={(e) => setMessage(e.target.value)} style={{ fontFamily: 'inherit', width: 'calc(100% - 8px)', fontSize: '11px', padding: '3px', resize: 'vertical' }} /></label>
          <button onClick={() => putRecruiterProfile(profileData.username, profileData)}>Update Profile</button>
        </div>
        <div>
          <h3 style={{ marginBlockStart: '10px', marginBlockEnd: '10px' }}>Generate & Copy Messages</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '5px', columnGap: '5px', paddingBottom: '10px' }}>
            <button onClick={() => loadMessage(MessageTemplates.RecruiterConnectionRequest)} style={{fontSize: '12px'}}>First Connection - RECR</button>
            <button onClick={() => loadMessage(MessageTemplates.RecruiterPostConnection)} style={{fontSize: '12px'}}>Post Connection - RECR</button>
            <button onClick={() => loadMessage(MessageTemplates.SoftwareEngineerConnectionRequest)} style={{fontSize: '12px'}}>First Connection - SFWE</button>
            <button onClick={() => loadMessage(MessageTemplates.SoftwareEngineerPostConnection)} style={{fontSize: '12px'}}>Post Connection - SFWE</button>
          </div>
          <button onClick={init}>Reload Popup Synthetically</button>
        </div>
      </div>
    </div>
  )
}

render(<Popup />, document.getElementById('root'))
