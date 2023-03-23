const { spawnSync } = require('child_process')

function system(cmd, printStdout = true) {
  return spawnSync(cmd, {
    stdio: printStdout ? 'inherit' : 'pipe',
    shell: true,
  })
}

function parseStdout({ stdout }) {
  return stdout.toString().trim()
}

if (process.platform === 'win32') {
  system('scripts\\launch\\start.cmd')
}
else if (process.platform === 'darwin') {
  const existsITerm2 = parseStdout(
    system('osascript ./scripts/launch/mac/exists_iTerm.scpt', false),
  )

  if (existsITerm2 === 'true')
    system('osascript ./scripts/launch/mac/launch_iTerm.scpt')

  else
    system('osascript ./scripts/launch/mac/launch_terminal.scpt')
}
