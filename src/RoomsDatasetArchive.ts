import JSZip, {JSZipObject} from "jszip";
import * as parse5 from "parse5";
import {Document} from "parse5";

export default class RoomsDatasetArchive {
    private readonly jsZip: JSZip;
    private readonly indexDocument: Document;
    private readonly buildingDocuments: Document[];

    private constructor(jsZip: JSZip, indexDocument: Document, buildingDocuments: Document[]) {
        this.jsZip = jsZip;
        this.indexDocument = indexDocument;
        this.buildingDocuments = buildingDocuments;
    }

    // Given a content buffer from a zip file, returns a RoomsDatasetArchive with given file's content
    public static async createRoomsDatasetArchiveFromContentBuffer(content: string): Promise<RoomsDatasetArchive> {
        const jsZip = new JSZip();
        try {
            await jsZip.loadAsync(content, {base64: true});
            // index.htm
            let indexFile: JSZipObject;
            const indexFileArray: JSZipObject[] = jsZip.file(/^rooms\/index.htm/);
            if (indexFileArray !== null && indexFileArray.length > 0) {
                indexFile = indexFileArray[0];
            } else {
                throw new Error("No index file");
            }
            const indexFileContents = await RoomsDatasetArchive.getFileContentsAsString(indexFile);
            const indexDocument = parse5.parse(indexFileContents);

            // building files
            const buildingFiles = jsZip.file(/^rooms\/campus\/discover\/buildings-and-classrooms\/.*$/);
            const length = buildingFiles.length;
            const buildingContentPromises: Promise<string>[] = new Array<Promise<string>>();
            for (let i = 0; i < length; i++) {
                buildingContentPromises.push(RoomsDatasetArchive.getFileContentsAsString(buildingFiles[i]));
            }
            const buildingDocuments = new Array<Document>();
            const buildingFileContents = await Promise.all(buildingContentPromises);
            for (let i = 0; i < length; i++) {
                buildingDocuments.push(parse5.parse(buildingFileContents[i]));
            }

            return new RoomsDatasetArchive(jsZip, indexDocument, buildingDocuments);
        } catch (err) {
            return Promise.reject(new Error("Not a ZIP file"));
        }
    }

    public static getFileContentsAsString(file: JSZipObject): Promise<string> {
        return file.async("string");
    }

    public getIndexDocument() {
        return this.indexDocument;
    }

    public getBuildingDocuments() {
        return this.buildingDocuments;
    }
}
