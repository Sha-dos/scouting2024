"use server";
import fs from "fs";

export async function writeData(json: string) {
    fs.writeFileSync("data.json", json, {flag: 'w'});
}

export async function readData() {
    return fs.readFileSync("data.json").toString();
}