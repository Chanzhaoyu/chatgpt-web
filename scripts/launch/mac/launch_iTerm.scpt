on run argv
    tell application "iTerm"
        activate
        set W to create window with default profile
        tell W's current session
            split vertically with default profile
        end tell
        set T to W's current tab
        set ProjectRoot to "$(dirname $(dirname $(dirname $(dirname " & (POSIX path of (path to me)) & "))))"
        write T's session 1 text "pnpm -F chatgpt-web-service -C \"" & ProjectRoot & "\" start"
        write T's session 2 text "pnpm -C \"" & ProjectRoot & "\" dev"
    end tell
end run
