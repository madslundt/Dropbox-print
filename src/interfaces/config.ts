export interface IConfig {
    accessToken: string,
    filePath: string,
    dropboxPath: string,
    mail: IMail
}

export interface IMail {
    smtp: ISMTP,
    sender: string,
    receiver: string,
    subject?: string,
}

export interface ISMTP {
    service: string,
    host: string,
    port: number,
    user: string,
    password: string
}