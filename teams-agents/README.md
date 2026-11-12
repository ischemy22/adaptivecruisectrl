# Teams agents for the discovery services team (V1)

Three separate Teams chats, one per job. Each teammate gets their own private chat with each.

| Agent | What it does | State |
|---|---|---|
| Media ID | Registers a Media ID, creates the archive folder, zips on command with a fingerprint | Scripts built and tested. Teams side needs your values and a first test. |
| Department Mailbox | Answers questions from the department mailbox and names the emails it used | Ready to build in Copilot Studio. Needs your testing. |
| Matter Team | Adds a user to an Intapp matter team, offers to create a missing one | Not working yet. Needs one discovery step first. |

## How it works

```
Teammate in Teams
      |
Copilot Studio agent  --(SharePoint)-->  "requests" folder in a Teams/SharePoint site
                                              |  OneDrive sync
                                         same folder on the always-on VM
                                              |
                                         Worker.ps1 (PowerShell) does the job on the
                                         firm network: creates the folder, zips, etc.
                                              |
Copilot Studio agent  <--(SharePoint)--  "results" folder
```

- There are no Power Automate flows. The agents use SharePoint and Outlook directly.
- The worker is one PowerShell script that uses only built-in commands, so it runs without admin rights and in Constrained Language mode.
- The mailbox agent does not use the worker at all.
- Every request and its outcome is appended to `request-log.csv` in the queue folder.

## Setup, in order

### Step 0. Three checks (10 minutes)

1. On the VM, in PowerShell, run `Test-Path C:\Windows\System32\tar.exe`. It must say `True`.
2. Copy the `worker` folder to the VM, then run `.\Test-Worker.ps1` in it. Every line must say `PASS`. This uses throwaway folders only. If PowerShell says running scripts is disabled, stop there and tell whoever is helping you; that needs a different way of starting the worker.
3. In Copilot Studio, start a new agent and confirm you can see **Tools > Add a tool > SharePoint** and **Channels > Teams and Microsoft 365 Copilot**. If either is missing, your licence does not cover this and IT has to be asked.

### Step 1. Create the queue folder

1. In a Teams team that contains only your six people, open **Files** and create a folder `Automation Queue` with two folders inside: `requests` and `results`.
2. On the VM, open that folder in the browser and choose **Sync** (or **Add shortcut to My files**) so it appears in File Explorer.
3. In File Explorer on the VM, right-click `Automation Queue` and choose **Always keep on this device**.

Anyone who can add files to `requests` can make the worker act. Keep that team to the six of you.

### Step 2. Start the worker

1. In the `worker` folder on the VM, copy `config.sample.json` to `config.json` and fill it in:

   | Setting | Meaning |
   |---|---|
   | `QueueRoot` | The synced `Automation Queue` folder on the VM |
   | `ArchiveRoot` | The media archive share where the dated folders go |
   | `ZipRoot` | Where zips are written (can be the same as `ArchiveRoot`) |
   | `DateFormat` | Date part of the folder name. `yyyyMMdd` gives `20261112_1234_Description` |
   | `IntappServiceUrl` | Leave as is until you work on the matter team agent |

   In this file every `\` in a path is written twice, as in the sample.
2. Double-click `Start-Worker.cmd`. A window opens and says "Worker started". Leave it open.
3. To start it automatically, put a shortcut to `Start-Worker.cmd` in the folder that opens when you press Win+R and type `shell:startup`. The VM must stay signed in to your account, because OneDrive only syncs while you are signed in.

### Step 3. Media ID agent

Follow `agents/media-id-agent.md`. Its `ping` test is the first proof that the whole chain works.

### Step 4. Department Mailbox agent

Follow `agents/mailbox-agent.md`. Test it alone before giving anyone else mailbox access.

### Step 5. Matter Team agent

Follow "Finishing the matter team app" in `HANDOVER.md`. Its first step is a read-only test.

### Step 6. Share with the team

For each agent: **Publish**, then **Channels > Teams and Microsoft 365 Copilot**, then use the
availability option for teammates and shared users and send the link. Try it with one teammate
first. Whether each teammate needs their own Copilot licence is something I could not settle
from published sources, and that one trial will answer it.

## What has been proven and what has not

Proven here by running it:

- The worker and its self-test pass in Constrained Language mode (14 checks), run on PowerShell 7.4 on Linux.
- The zip step produced a valid zip of a folder containing a 5 GB file, using the same zip engine Windows ships as `tar.exe` (bsdtar 3.7.2).

Not proven, because it can only be tried in your environment:

- Windows PowerShell 5.1 on your VM. The scripts avoid newer features, and Step 0 checks this.
- Zipping to and from network (`\\server\...`) paths with `tar.exe`. The first real `zip` request checks this.
- That a Copilot Studio agent writes the request file as plain text and reads the result back cleanly. The `ping` test checks this before anything else depends on it.
- The exact names of the Outlook tool inputs, and the mailbox agent's reach into older mail.
- Everything about Intapp. One public write-up describes the Walls interface as a web service named `APIService.svc` with an operation `AddUsersToMatterTeam`. I found no official documentation.

## Known limits of V1

- The reply is not instant. The request travels through OneDrive sync, so the teammate asks, then says `path 1234` about a minute later.
- One worker handles one request at a time. A large zip makes other requests wait. Starting a second worker window is safe and removes the wait.
- `tar.exe` cannot password-protect a zip. If the vendor requires encrypted zips, the zip step needs 7-Zip instead.
- Do not open `request-log.csv` in Excel on the VM itself; open it from SharePoint. A locked log stops the worker.

## V2: one chat for everything

All three agents already share one queue, one worker and one log, so V2 is one agent with
all the tools and the three instruction blocks combined. One caution for that step: the
mailbox agent reads email written by outsiders, and an email can contain text designed to
steer an AI. In V1 that agent cannot do anything but read. Once the same chat can also add
people to matter teams, keep a yes/no confirmation in front of every Intapp change.

## Where this is stored

This folder sits on a branch of a public GitHub repository that also hosts a website. It
contains no firm names, addresses, server names or credentials, and `config.json` and the
saved Intapp credential are excluded from Git. Keep it that way, or move the folder to a
private repository. If this branch is merged into the website's main branch, these files
would be published on the site.
