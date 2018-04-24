About
=====
Listen to a Dropbox folder and send the file(s) to an email address and finally deletes the file from Dropbox folder.

Install
=======
It has not been published to NPM.

For now just run the two commands:
 1. `git clone https://github.com/madslundt/sonarr-pogdesign-importer.git`.
 2. `npm install`

Run
===
Make sure to create a config.json file and then run:
`node dist/index.js -c <CONFIG PATH>`

Create config
=============
```
{
    "accessToken": "abcdef12345",
    "filePath": "/folder",
    "dropboxPath": "/uploads",
    "mail": {
        "smtp": {
            "service": "Gmail",
            "host": "smtp.gmail.com",
            "port": 587,
            "user": "user@gmail.com",
            "password": "password"
        },
        "sender": "sender@gmail.com",
        "receiver": "receiver@gmail.com"
    }
}
```

**accessToken**: Access token from Dropbox

**filePath**: Folder to store files downloaded from Dropbox locally. This is just temporary and gets deleted short time after the email has been sent.

**dropboxPath**: Dropbox folder to watch and download files from.

**mail**: Mail settings including SMTP server.
