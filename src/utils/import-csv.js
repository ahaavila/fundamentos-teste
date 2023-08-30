import fs from 'node:fs'
import { parse } from 'csv-parse'

const path = new URL('../../database.csv', import.meta.url)

const readableStream = fs.createReadStream(path)

const parser = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2
})

async function run() {
    const linesParse = readableStream.pipe(parser)

    for await (const line of linesParse) {
        const [title, description] = line

        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description
            })
        })
    }
}

run()