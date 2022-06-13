const RECRUITER_CONNECTION_REQUEST_MESSAGE_TEMPLATE = `\
Hello, {fname}!

My name is {my_fname} and I'm currently a {my_position}.
I saw your profile and wanted to reach out and introduce myself.
If you have time, I would love the opportunity to discuss how my \
skills and experience align with any open roles {company} is looking to fill.

Best,
{my_fname}`
const RECRUITER_POST_CONNECTION_MESSAGE_TEMPLATE = `\
Hi {fname}, thank you for accepting my connection request!

Please find my updated resume attached to this message.
If you think I may be a good fit for any position you or someone you know may be recruiting for, \
please feel free to reach out via phone, email or LinkedIn message \
and we can put some time on the calendar for a call.
I look forward to hearing from you!

{my_name}
Tel: {my_tel}
Email: {my_email}`
const INIT_CONNECTION_MESSAGE_SWE = `\
Hello, {fname}!

My name is {my_fname} and I'm currently a {my_position}.
I saw your profile and wanted to reach out and introduce myself.
If you have time, I would love the opportuntity to learn more about your \
day to day experience as a {headline} at {company}.

Best,\
Amir`
const POST_CONNECTION_MESSAGE_SWE = '\
Hello, {fname}'

export const MessageTemplates = Object.freeze({
  RecruiterConnectionRequest: RECRUITER_CONNECTION_REQUEST_MESSAGE_TEMPLATE,
  RecruiterPostConnection: RECRUITER_POST_CONNECTION_MESSAGE_TEMPLATE,
  SoftwareEngineerConnectionRequest: INIT_CONNECTION_MESSAGE_SWE,
  SoftwareEngineerPostConnection: POST_CONNECTION_MESSAGE_SWE
})

export const Position = Object.freeze({
  Recruiter: 'Recruiter',
  SoftwareEngineer: 'Software Engineer'
})

export const MyInformation = Object.freeze({
  FullName: 'Amir',
  FirstName: 'Amir',
  LastName: 'Sharapov',
  Position: 'Software Engineer',
  Telephone: '(331) 255 - 6927',
  Email: 'amirfounder18@gmail.com'
})
