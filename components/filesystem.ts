export async function writeData(json: string) {
    localStorage.setItem("data", json);
}

export async function readData() {
    return localStorage.getItem("data")?.toString()
}
