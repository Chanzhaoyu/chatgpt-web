on run argv
    tell application "Terminal"
        activate
        set ProjectRoot to "$(dirname $(dirname $(dirname $(dirname " & (POSIX path of (path to me)) & "))))"
        do script "cd " & ProjectRoot & " && pnpm -F chatgpt-web-service start"
        do script "cd " & ProjectRoot & " && pnpm dev"
    end tell
end run
