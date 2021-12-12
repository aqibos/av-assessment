const fs = require('fs'); 
const parser = require('csv-parse')

const fileName = './input.csv';
const outDirectory = './out'
const columns = ['user_id', 'first_name', 'last_name', 'version', 'insurance'];

// MAIN
readCsvFile(fileName, processEnrollees, true);

/**
 * Reads the input file specified, and invokes the handler on end.
 * @param {string} fileName - the name of the input file
 * @param {(data: [Enrollee]) => void} onEndHandler - handler to invoke on end
 * @param {boolean} includesHeader - whether the input file contains a header line
 */
function readCsvFile(fileName, onEndHandler, includesHeader = false) {
    const data = [];
    let header = null;
    let isHeader = includesHeader
    fs.createReadStream(fileName)
        .pipe(parser.parse({ delimiter: ',' }))
        .on('data', (l) => {
            if (isHeader) {
                isHeader = false;
                return;
            }

            data.push(parseEnrollee(l));        
        })
        .on('end', () => { onEndHandler(data); })
}

/**
 * Groups the enrollees by insurance, keeps the higher version on duplicate user ID,
 * and writes them to individual files sorted by last name, then first name.
 * @param {[Enrollee]} enrollees - the enrollees to process
 */
function processEnrollees(enrollees) {
    const compareVersion = (a, b) => a.version > b.version ? a : b;
    const compareName = (a, b) => {
        if (a.lastName === b.lastName) { return a.firstName.localeCompare(b.firstName); }
        return a.lastName.localeCompare(b.lastName);
    }

    const groups = groupBy('insurance', enrollees);
    for (let insurance in groups) {
        const result = mergeBy('userId', compareVersion, groups[insurance]);
        const sorted = result.sort(compareName);
        writeCsvFile(insurance, sorted, true);
    }
}

/**
 * Writes the enrollees to the specified file in CSV format
 * @param {string} fileName - the name of the output file
 * @param {[Enrollee]} data - the enrollees
 * @param {boolean} includeHeader - whether to include a header in the output file
 */
function writeCsvFile(fileName, data, includeHeader = false) {
    const lines = data.map(toCsvString);
    const writeStream = fs.createWriteStream(`${outDirectory}/${fileName}.csv`, { flags: 'w' });
    writeStream.on('open', function() {
        if (includeHeader) {
            writeStream.write(columns.join(',') + '\n', 'utf-8');
        }

        writeStream.write(lines.join('\n'), 'utf-8');
    })
}

/**
 * Groups a list of objects based on a specific key
 * @param {string} key - key to group the items in the list by
 * @param {[Any]} list - the list of items to group
 * @returns - The grouped items
 */
function groupBy(key, list) {
    const grouped = {};
    list.forEach(x => {
        if (grouped.hasOwnProperty(x[key])) {
            grouped[x[key]].push(x);
        } else {
            grouped[x[key]] = [x];
        }
    });
    return grouped;
}

/**
 * Merges duplicate objects in list based on key
 * @param {string} key - the key to merge the objects by
 * @param {(T, T) => T} duplicateHandler - handler for when more than 1 match is found for key
 * @param {*} list - the list of items to merge
 * @returns - The merged list
 */
function mergeBy(key, duplicateHandler, list) {
    const merged = {};
    list.forEach(incoming => {
        if (merged.hasOwnProperty(incoming[key])) {
            const existing = merged[incoming[key]];
            merged[incoming[key]] = duplicateHandler(incoming, existing)
        } else {
            merged[incoming[key]] = incoming;
        }
    });
    return Object.keys(merged).map(x => merged[x]);
}

/**
 * Parses a comma seperated enrollee 
 * @param {string} line - enrollee data as string
 * @returns - Enrollee obj
 */
function parseEnrollee(line) {
    let userId = parseInt(line[0]);
    let firstName = line[1];
    let lastName = line[2];
    let version = parseInt(line[3]);
    let insurance = line[4];

    // We can choose to exit processing here if validations fail, or provide defaults
    if (isNaN(userId)) { userId = -1; }
    if (isNaN(version)) { version = 1; }
    if (!insurance) { insurance = "__not_provided" }

    return { userId, firstName, lastName, version, insurance };
}

/**
 * Converts the enrollee into a comma seperated string
 * @param {Enrollee} e - the enrollee
 * @returns - string representation of the enrollee 
 */
function toCsvString(e) {
    return `${e.userId},${e.firstName},${e.lastName},${e.version},${e.insurance}`;
}