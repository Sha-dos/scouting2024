/*"use server";
import fs from "fs";

export async function writeData(json: string) {
    fs.writeFileSync("data.json", json, {flag: 'w'});
}

export async function readData() {
    return fs.readFileSync("data.json").toString();
}*/

import { invoke } from '@tauri-apps/api/tauri'
import {BaseDirectory, createDir, readTextFile, writeTextFile} from "@tauri-apps/api/fs";

export async function writeData(json: string) {
    //await invoke('write_file', { json: json });
    //await writeTextFile({ path: 'data.json', contents: json }, { dir: BaseDirectory.App });
    localStorage.setItem("data", json);
}

export async function readData() {
    // @ts-ignore
    //return invoke('read_file').then((value) => value.toString())
    //return await readTextFile('data.json', { dir: BaseDirectory.App })
    return localStorage.getItem("data")?.toString()
}
