# Media ID agent

Build this one first. It registers a new Media ID in your SharePoint list, has the worker
create the archive folder, and zips the folder on command.

## What a teammate types

| They type | What happens |
|---|---|
| `new media id` (plus case and description) | Entry is added to the list, folder is requested |
| `path 1234` | Replies with the folder path to paste into File Explorer |
| `zip 1234` | Worker zips the folder and fingerprints the zip |
| `zip status 1234` | Replies with zip path and fingerprint, and saves the fingerprint on the entry |
| `ping` then `ping status` | Confirms the worker on the VM is alive |

## Fill in before you start

| Placeholder | Your value |
|---|---|
| `[SITE]` | Address of the SharePoint site that holds the queue folder |
| `[REQUESTS FOLDER]` | The `requests` folder, for example `/Shared Documents/General/Automation Queue/requests` |
| `[RESULTS PATH]` | The `results` folder path ending in `/`, for example `/Shared Documents/General/Automation Queue/results/` |
| `[MEDIA LIST SITE]` and `[MEDIA LIST]` | Site and name of your Media ID list |
| `[ID COLUMN]` | The column that holds the Media ID after saving (`ID` if it is the built-in number) |
| `[OTHER FIELDS]` | The other things you fill in on the form today, such as custodian or media type |

One-time list change: add a single-line text column named `Zip SHA256` to the Media ID list.

## Create the agent

In Copilot Studio: **Agents > New agent**, skip to configure, then:

- **Name:** Media ID
- **Description:** Registers new media, creates the archive folder, and zips media for the vendor.
- **Instructions:** paste the block below, replacing the placeholders.

```
You help the discovery services team register new media and prepare it for the processing vendor.
Be brief. Never invent a Media ID, folder path or fingerprint. Only report what a tool returned.
In every request you send, requestedBy is the name of the person you are talking to.

NEW MEDIA ID
When the user asks for a new media ID:
1. Collect the case, a short description of the media, and [OTHER FIELDS]. Ask for everything that is missing in one message.
2. Clean the description so it can be used in a folder name: letters, numbers, spaces and hyphens only, 80 characters at most, starting and ending with a letter or number. If you changed it, show the cleaned version.
3. Use "Create Media ID entry". The Media ID is the [ID COLUMN] value the tool returns.
4. Use "Send request to worker" with file name media-<MediaID>.json and exactly this content:
{"action":"media-folder","mediaId":"<MediaID>","description":"<cleaned description>","requestedBy":"<name>"}
5. Reply: Media ID <MediaID> is registered and the folder is being created. Say "path <MediaID>" in about a minute.

PATH
When the user says "path <MediaID>": use "Read worker result" with the path [RESULTS PATH]media-<MediaID>.txt.
If status is ok, reply with folderPath on a line by itself so it can be copied.
If status is error, show the message exactly as written.
If the file is not found, say the worker has not answered yet and to try again shortly. If it keeps happening, the worker window on the VM may be closed.

ZIP
When the user says "zip <MediaID>":
1. Use "Send request to worker" with file name zip-<MediaID>.json and exactly this content:
{"action":"media-zip","mediaId":"<MediaID>","requestedBy":"<name>"}
2. Reply: zipping has started. Large media can take a long time. Say "zip status <MediaID>" to check.

ZIP STATUS
When the user says "zip status <MediaID>": use "Read worker result" with the path [RESULTS PATH]zip-<MediaID>.txt.
If status is ok, use "Save zip fingerprint" to store sha256 on the entry, then reply with zipPath, sha256, fileCount and zipBytes.
If status is error, show the message exactly as written.
If the file is not found, say the zip is still running.

PING
When the user says "ping": use "Send request to worker" with file name ping.json and content {"action":"ping","requestedBy":"<name>"}, and tell the user to say "ping status".
When the user says "ping status": use "Read worker result" with the path [RESULTS PATH]ping.txt and show the message and completedAt.
```

The agent has to know who it is talking to in order to fill in `requestedBy`. After pasting,
click at the end of the third line, type `/`, and choose the system variable
**User.DisplayName** if it is offered. I could not confirm that picker from here. If it is
not offered, leave the line as it is and check what name appears in `request-log.csv`.
Either way, SharePoint's own "Created By" on each request file is the reliable record of
who asked.

## Add the tools

**Tools > Add a tool > SharePoint.** Add the four below. For each input choose
**Custom value** (a fixed value you type) or **Dynamically fill with AI**, as listed.
Leave authentication on the default so each teammate signs in as themselves.

| Tool name to give it | SharePoint action | Inputs |
|---|---|---|
| Create Media ID entry | Create item | Site Address: custom `[MEDIA LIST SITE]`. List Name: custom `[MEDIA LIST]`. Each list column: fill with AI. |
| Send request to worker | Create file | Site Address: custom `[SITE]`. Folder Path: custom `[REQUESTS FOLDER]`. File Name: fill with AI, description "The exact file name given in the instructions". File Content: fill with AI, description "The exact one-line JSON text given in the instructions, nothing else". |
| Read worker result | Get file content using path | Site Address: custom `[SITE]`. File Path: fill with AI, description "The exact path given in the instructions". |
| Save zip fingerprint | Update item | Site Address and List Name as for Create item. Id: fill with AI, "The Media ID". `Zip SHA256`: fill with AI, "The sha256 value from the worker result". Every other column: leave empty. |

If the case drop-down is a lookup to another list, "Create item" will want the case's
number, not its name. In that case also add **Get items** on the case list, named
"Find case", and add this line to step 1 of the instructions: `Use "Find case" to get the
case's Id before creating the entry.`

## Test in the test pane before publishing

1. `ping`, wait a minute, `ping status`. This proves Teams, SharePoint, OneDrive and the worker are all connected. Do not go further until it works.
2. `new media id`, answer the questions, then `path <id>`. Check the list entry and the folder.
3. Drop a small file in the folder, `zip <id>`, then `zip status <id>`. Check the zip, the `.sha256.txt` file next to it, and the `Zip SHA256` column.
