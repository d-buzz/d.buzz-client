const { default: config } = require("config")

const updates = {
  status: true,

  changes: `
  ### Buzz Title Bar ✏
  * Now you can add a custom buzz title of upto 60 characters.
  * We've removed the additional buzz title modal.
  * Just click on <b>Title</b> button to open the title bar. 
  ${config.VERSION.includes('dev') ? '###### Thanks for being beta a tester of this feature 🧪': ''}
`,
  
  fixes: `
  - Fixed content truncating because of title, now title and the content will be calculated before publishing a buzz.
  - Few minor bug fixes and improvements to make DBuzz even better.
  `,

  upcoming: `
  - We’re working on a Mutelist system where users will be able to mute spammers on DBuzz.
  `,
}

export { updates }