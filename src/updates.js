const { default: config } = require("config")

const updates = {
  status: true,

  changes: `
  ### Videos on DBuzz are now in beta! 🎥
  * Now you can upload videos upto 60 secs on DBuzz.
  ${config.VERSION.includes('dev') ? '###### Thanks for being beta a tester of this feature 🧪': ''}
`,
  
  fixes: `
  - Fixed video upload button not working on mobile devices.
  - Fixed buzz title resets on opening buzz modal.
  - Few minor bug fixes and improvements to make DBuzz even better.
  `,

  improvements: `
  ### UI Refresh of Buzz Box
  * We have refreshed the UI of our buzz box to make it more clean for our users.
  ### UI Improvement of Buzz Threads Box
  * We have refreshed the UI of our buzz threads box, now it will show a clear view of each connected buzz.
`,

  upcoming: `
  - We’re working on a Mutelist system where users will be able to mute spammers on DBuzz.
  `,
}

export { updates }