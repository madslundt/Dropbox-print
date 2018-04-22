"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('es6-promise').polyfill();
require('isomorphic-fetch');
const dropbox_1 = require("dropbox");
const fs = require("fs");
const Path = require("path");
const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require("nodemailer");
class App {
    constructor(config) {
        this.config = config;
        this.dropbox = new dropbox_1.Dropbox({ accessToken: config.accessToken });
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
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.getFiles();
            if (files.length > 0) {
                yield this.downloadFiles(files);
                yield this.deleteFiles(files);
                this.sendEmails(files);
                console.log(`${files.length} files processed`);
            }
        });
    }
    sendEmails(files) {
        const filenames = files.map(file => file.name);
        this.sendEmail(filenames);
    }
    downloadFiles(files) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Downloading ${files.length} files`);
            for (const file of files) {
                if (!file.path_lower) {
                    continue;
                }
                const downloadedFile = yield this.dropbox.filesDownload({
                    path: file.path_lower
                });
                const data = downloadedFile.fileBinary;
                if (!!data) {
                    const filePath = Path.join(this.config.filePath, downloadedFile.name);
                    fs.writeFile(filePath, data, { encoding: 'binary' }, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
        });
    }
    deleteFiles(files) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dropbox.filesDeleteBatch({
                entries: files.map(file => { return { path: file.path_lower || "" }; })
            });
        });
    }
    sendEmail(filenames) {
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
            setTimeout(() => { fs.unlink(filePath, (err) => { }); }, 10000);
        }
    }
    getFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.dropbox.filesListFolder({ path: this.config.dropboxPath });
            if (files && files.entries) {
                return files.entries;
            }
            else {
                return [];
            }
        });
    }
}
exports.default = App;
