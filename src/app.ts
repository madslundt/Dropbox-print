require('es6-promise').polyfill();
require('isomorphic-fetch');
import { Dropbox } from 'dropbox';
import { IConfig } from './interfaces/config';
import * as fs from 'fs';
import * as Path from 'path';
const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer: any = require("nodemailer");

class App {
    private readonly config: IConfig;
    private readonly dropbox: Dropbox;
    private readonly transporter: any;

    constructor(config: IConfig) {
        this.config = config;
        this.dropbox = new Dropbox({ accessToken: config.accessToken });

        this.transporter = nodemailer.createTransport(smtpTransport({
            service: config.mail.smtp.service,
            host: config.mail.smtp.host,
            port: config.mail.smtp.port,
            auth: {
                user: config.mail.smtp.user,
                pass: config.mail.smtp.password
            }
        }));
    }

    public async process() {
        const files = await this.getFiles();
        if (files.length > 0) {
            await this.downloadFiles(files);
            await this.deleteFiles(files);
            this.sendEmails(files);

            console.log(`${files.length} files processed`);
        }
    }

    private sendEmails(files: (DropboxTypes.files.FileMetadataReference | DropboxTypes.files.FolderMetadataReference | DropboxTypes.files.DeletedMetadataReference)[]) {
        const filenames = files.map(file => file.name);
        this.sendEmail(filenames);
    }

    private async downloadFiles(files: (DropboxTypes.files.FileMetadataReference | DropboxTypes.files.FolderMetadataReference | DropboxTypes.files.DeletedMetadataReference)[]) {
        console.log(`Downloading ${files.length} files`);
        for (const file of files) {
            if (!file.path_lower) {
                continue;
            }

            const downloadedFile = await this.dropbox.filesDownload({
                path: file.path_lower
            });

            const data = (<any> downloadedFile).fileBinary;

            if (!!data) {
                const filePath = Path.join(this.config.filePath, downloadedFile.name);

                (<any>fs).writeFile(filePath, data, { encoding: 'binary' }, (err: any) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    }

    private async deleteFiles(files: (DropboxTypes.files.FileMetadataReference | DropboxTypes.files.FolderMetadataReference | DropboxTypes.files.DeletedMetadataReference)[]) {
        this.dropbox.filesDeleteBatch({
            entries: files.map(file => { return { path: file.path_lower || "" }; })
        });
    }

    private sendEmail(filenames: string[]) {
        console.log(`Sending ${filenames.length} photos`);

        for (const filename of filenames) {
            const filePath = Path.join(this.config.filePath, filename);

            this.transporter.sendMail({
                from: this.config.mail.sender,
                to: this.config.mail.receiver,
                subject: this.config.mail.subject || 'Print',
                attachments: [{
                    filename: filename,
                    path: filePath
                }]
            });

            setTimeout(() => { fs.unlink(filePath, (err) => {}) }, 10000);
        }
    }

    private async getFiles() {
        const files = await this.dropbox.filesListFolder({ path: this.config.dropboxPath });

        if (files && files.entries) {
            return files.entries;
        } else {
            return [];
        }
    }
}

export default App;