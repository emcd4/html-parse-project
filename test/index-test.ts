import { expect } from 'chai';
import * as fs from 'fs-extra';
import RoomsDatasetArchive from "../src/RoomsDatasetArchive";
import RoomsDatasetParser from "../src/RoomsDatasetParser";

function getContentFromArchive (name: string): string {
    return fs.readFileSync(`test/resources/${name}`).toString("base64");
}

describe('Verify Mocha Works', () => {
    it('Test One Building One Room Dataset', async () => {
        const content: string = getContentFromArchive('OneBuildingOneRoom.zip');
        const datasetArchive = await RoomsDatasetArchive.createRoomsDatasetArchiveFromContentBuffer(content);
        const datasetParser = new RoomsDatasetParser(datasetArchive);
        const indexTbodyNode = datasetParser.getTbody(datasetArchive.getIndexDocument());
        const buildingTbodyNode = datasetParser.getTbody(datasetArchive.getBuildingDocuments()[0]);
        const breakHere = true;
    });

    it('Test Large Rooms Dataset', async () => {
        const content: string = getContentFromArchive('rooms.zip');
        const datasetArchive = await RoomsDatasetArchive.createRoomsDatasetArchiveFromContentBuffer(content);
        const datasetParser = new RoomsDatasetParser(datasetArchive);
        const indexTbodyNode = datasetParser.getTbody(datasetArchive.getIndexDocument());
        const buildingTbodyNodes = new Array<any>();
        for (let i = 0; i < 5; i++) {
            try {
                buildingTbodyNodes.push(datasetParser.getTbody(datasetArchive.getBuildingDocuments()[i]));
            } catch (err) {
                // skip
            }
        }
        const breakHere = true;
    });
});