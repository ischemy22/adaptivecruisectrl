# Handover for an AI assistant

Paste this file, plus the file you want changed, into Copilot, ChatGPT or Claude when you
want to continue the work. It tells the assistant the rules it has to follow.

## The situation

- A six-person legal discovery services team uses Microsoft Teams. The owner is not a developer and has no admin rights.
- Three Copilot Studio agents are published to Teams: Media ID, Department Mailbox, Matter Team. Their instructions and tool settings are in `agents/`.
- Agents cannot reach the firm network. They write a small JSON request file into a SharePoint folder. OneDrive syncs that folder to an always-on Windows VM, where `worker/Worker.ps1` picks it up, does the job, and writes a result file the agent reads back.

## Rules for any code you write

1. Windows PowerShell 5.1 syntax only. No `?:`, `??`, `&&`, `-AsHashtable`, or other PowerShell 7 features.
2. It must run in Constrained Language mode. Use cmdlets and operators only. Do not use `[System.Anything]::Method()`, `New-Object` for .NET or COM types, `Add-Type`, `class`, or `New-WebServiceProxy`.
3. No modules to install, no admin rights, no scheduled tasks that need a stored password, no Power Automate flows.
4. Keep it simple: one way to do each thing, no fallback paths. When something is wrong, `throw` with a message a non-developer can act on.
5. Never put a password, server name or firm name in a file that is committed. Settings live in `config.json`; the Intapp credential lives in `intapp-credential.xml`. Both are ignored by Git.
6. After any change to `Worker.ps1`, `Test-Worker.ps1` must still print all PASS. Add a check there for anything new.

## Files

| File | Purpose |
|---|---|
| `worker/Worker.ps1` | The whole worker: settings, one function per job, the loop |
| `worker/Test-Worker.ps1` | Self-test with throwaway folders |
| `worker/Test-IntappConnection.ps1` | Read-only first contact with Intapp |
| `worker/config.sample.json` | Template for `config.json` |
| `worker/Start-Worker.cmd` | Double-click starter |
| `agents/*.md` | Instructions and tool settings for each Copilot Studio agent |

## The request and result contract

A request is a file `<requestId>.json` in `requests`. The file name without `.json` is the request ID.

```json
{"action":"media-folder","mediaId":"1234","description":"Custodian laptop Smith","requestedBy":"Name"}
{"action":"media-zip","mediaId":"1234","requestedBy":"Name"}
{"action":"matter-add-user","clientMatter":"012345-0001","username":"jsmith","createIfMissing":false,"requestedBy":"Name"}
{"action":"ping","requestedBy":"Name"}
```

The worker moves the request to `working`, runs it, writes `results/<requestId>.txt`
(JSON text), appends a row to `request-log.csv`, and moves the request to `done`.

A result always has `requestId`, `action`, `requestedBy`, `status`, `message`,
`completedAt`. `status` is `ok` or `error`. A job function returns a hashtable; every key
in it is copied into the result, so a job can add fields such as `folderPath`, and can set
`status` itself (the matter job will return `needs-confirmation`).

## How to add a new job

1. Write one function in `Worker.ps1` that takes `$Config` and `$Request`, reads its inputs with `Get-Field` (which validates them against a pattern), does the work, and returns a hashtable with at least `message`.
2. Add one line for it in the `switch` inside `Invoke-Request`.
3. Add checks to `Test-Worker.ps1`.
4. Add the wording to the agent's instructions.

## Finishing the matter team app

Nothing about Intapp has been confirmed. The only public information found is one
third-party article describing the on-premises Intapp Walls interface as a SOAP web
service, usually `APIService.svc`, reachable only inside the firm network, with operations
named `GetMatterTeamForMatter`, `LoadMatterTeam` and `AddUsersToMatterTeam`, users
identified by their Windows login name, and a role given when adding. Treat all of that as
a lead to check, not as fact. Nothing was found about creating a matter team.

Steps, in order. Do not skip ahead.

1. **Owner:** ask IT, or whoever issued the service account, for the web address of the Intapp Walls API, and whether the service account is allowed to add matter team members and create matter teams. Put the address in `config.json` as `IntappServiceUrl`.
2. **Owner:** on the VM run `.\Test-IntappConnection.ps1`. It asks for the service account once, then lists the operations the service offers and saves `intapp-wsdl.xml`. It changes nothing in Intapp.
   - If it fails, give the assistant the exact error text. An address that ends in `.svc` can also be tried in a browser on the VM with `?wsdl` added.
   - If the firm uses Intapp's cloud service, this script does not apply. Give the assistant whatever API documentation IT provides.
3. **Assistant:** from `intapp-wsdl.xml`, identify the operations for: finding the matter team for a client-matter number, listing its members, adding a user, and creating a matter team. Note the binding type. A plain HTTP binding can be called with `Invoke-WebRequest` and a hand-written SOAP envelope; a binding with message-level security cannot, and that must be raised with IT.
4. **Assistant:** write a read-only script first that looks up one matter team and lists its members, and have the owner run it against a matter they know. Only after that works, replace the `throw` in `Add-MatterTeamUser` in `Worker.ps1`.
5. The finished `Add-MatterTeamUser` must:
   - return `status = 'ok'` with a message if the user was added, or was already a member;
   - return `status = 'needs-confirmation'` if the matter team does not exist and `createIfMissing` is false;
   - create the team with the default settings and then add the user if `createIfMissing` is true;
   - `throw` on anything else.
6. **Owner:** write down the default settings for a new matter team exactly as they are set by hand today. They go in `config.json`, not in the script.
7. Test adding a user to a test matter before any real one.

## Other open items

- The Media ID list's column names, and whether the case column is a choice or a lookup, are not known. See the note under the tools table in `agents/media-id-agent.md`.
- The archive path, zip destination and date format are settings in `config.json`.
- If the vendor needs password-protected zips, replace the `tar.exe` call in `New-MediaZip` with 7-Zip and keep the fingerprint step.
