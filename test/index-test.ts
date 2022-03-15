import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as parse5 from "parse5";
import DatasetArchive from "../src/DatasetArchive";

function getContentFromArchive (name: string): string {
    return fs.readFileSync(`test/resources/${name}`).toString("base64");
}

async function getBuildingDocuments(datasetArchive: DatasetArchive) {
    const buildingDocuments = new Array<any>();
    const buildingFileContentPromises= new Array<any>();
    const buildingFiles = datasetArchive.getBuildingFiles();
    const length = buildingFiles.length;
    for (let i = 0; i < length; i++) {
        buildingFileContentPromises[i] = DatasetArchive.getFileContentsAsString(buildingFiles[i]);
    }
    const buildingFileContents = await Promise.all(buildingFileContentPromises);
    for (let i = 0; i < length; i++) {
        buildingDocuments[i] = parse5.parse(buildingFileContents[i]);
    }
    return buildingDocuments;
}

function getTbody(doc: any) {
    // html
    // body
    // div array
    // div array
    // div array
    // section
    // div array
    // div array
    // table
    // tbody
}

function recursiveSearchForTbody(node: any) {
    if (node.nodeName === "tbody") {
        return node;
    } else {
        if (node.childNodes !== null && node.childNodes.length > 0) {
            for (const child of node.childNodes) {
                if (child.nodeName === "html" || child.nodeName === "body" || child.nodeName === "section" || child.nodeName === "table" || child.nodeName === "div" || child.nodeName === "tbody") {
                    const result = recursiveSearchForTbody(child);
                    if (result !== null) {
                        return result;
                    }
                }
            }
        }
        return null;
    }
}

describe('Verify Mocha Works', () => {
    it('Parses an HTML file', async () => {
        // TODO
        const content: string = getContentFromArchive('OneBuildingOneRoom.zip');
        const datasetArchive = await DatasetArchive.createArchiveFromContentBuffer(content);

        const indexFileContents: string = await DatasetArchive.getFileContentsAsString(datasetArchive.getIndexFile());
        const indexDocument = parse5.parse(indexFileContents);
        const buildingDocuments = await getBuildingDocuments(datasetArchive);

        const indexTbody = getTbody(indexDocument);
        const tbodyArray = new Array<any>();
        for (const doc of buildingDocuments) {
            // find tbody
            // look in html
            tbodyArray.push(getTbody(doc));
            // go through childNodes of tbody and pull our the tr tags
            // extract information contained in the tr elements
        }
        const breakHere = true;
    });
});