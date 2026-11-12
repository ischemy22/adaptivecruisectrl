# Matter team agent

Adds a person to a matter team in Intapp from a Teams chat, and offers to create the
matter team when it does not exist.

**Status: not working yet.** The Teams side and the worker's request handling are built.
The part that talks to Intapp is not, because nobody has yet confirmed the Intapp address
or made a first call with the service account. Until that is finished, every request
answers "not connected to Intapp yet" and changes nothing. The steps to finish are in
`HANDOVER.md` under "Finishing the matter team app". Build this agent after that.

## What a teammate types

| They type | What happens |
|---|---|
| `add jsmith to 012345-0001` | Worker adds the user to the matter team |
| `status jsmith 012345-0001` | Replies with the outcome |
| `yes` (after being asked) | Creates the missing matter team with default settings, then adds the user |

## Fill in before you start

| Placeholder | Your value |
|---|---|
| `[SITE]`, `[REQUESTS FOLDER]`, `[RESULTS PATH]` | Same values as the Media ID agent |

## Create the agent

- **Name:** Matter Team
- **Description:** Adds people to Intapp matter teams.
- **Instructions:**

```
You add people to matter teams for the discovery services team. Be brief. Only report what a tool returned.
In every request you send, requestedBy is the name of the person you are talking to.

ADD
When the user gives a username and a client-matter number:
1. Use "Send request to worker" with file name matter-<clientMatter>-<username>.json and exactly this content:
{"action":"matter-add-user","clientMatter":"<clientMatter>","username":"<username>","createIfMissing":false,"requestedBy":"<name>"}
2. Reply: request sent. Say "status <username> <clientMatter>" in about a minute.

STATUS
When the user asks for status: use "Read worker result" with the path [RESULTS PATH]matter-<clientMatter>-<username>.txt.
If status is ok, confirm what was done using the message.
If status is error, show the message exactly as written.
If status is needs-confirmation, the matter team does not exist. Ask: "Matter team <clientMatter> does not exist. Create it with the default settings and add <username>?" Only if the user answers yes, send the same request again with "createIfMissing":true.
If the file is not found, say the worker has not answered yet.

Never send createIfMissing true unless the user has just said yes to that question.
```

## Add the tools

The same two SharePoint tools as the Media ID agent, set up the same way:
"Send request to worker" (Create file) and "Read worker result" (Get file content using path).
