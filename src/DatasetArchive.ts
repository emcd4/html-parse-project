import JSZip, {JSZipObject} from "jszip";

export default class DatasetArchive {
    private readonly jsZip: JSZip;
    private readonly indexFile: JSZipObject;
    private readonly buildingFiles: JSZipObject[];

    private constructor(jsZip: JSZip) {
        this.jsZip = jsZip;

        // index.htm
        const indexFileArray: JSZipObject[] = this.jsZip.file(/^rooms\/index.htm/);
        if (indexFileArray !== null && indexFileArray.length > 0) {
            this.indexFile = indexFileArray[0];
        } else {
            throw new Error("No index file");
        }

        // building files
        this.buildingFiles = this.jsZip.file(/^rooms\/campus\/discover\/buildings-and-classrooms\/.*$/);
    }

    // Given a content buffer from a zip file, returns a DatasetArchive with given file's content
    public static async createArchiveFromContentBuffer(content: string): Promise<DatasetArchive> {
        const jsZip = new JSZip();
        try {
            await jsZip.loadAsync(content, {base64: true});
            return new DatasetArchive(jsZip);
        } catch (err) {
            return Promise.reject("Not a zip file");
        }
    }

    public static getFileContentsAsString(file: JSZipObject): Promise<string> {
        return file.async("string");
    }

    public getIndexFile() {
        return this.indexFile;
    }

    public getBuildingFiles() {
        return this.buildingFiles;
    }
}
