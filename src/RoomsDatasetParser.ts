import RoomsDatasetArchive from "./RoomsDatasetArchive";
import {Document} from "parse5";

export default class RoomsDatasetParser {
    private readonly datasetArchive: RoomsDatasetArchive;

    constructor(datasetArchive: RoomsDatasetArchive) {
        this.datasetArchive = datasetArchive;
    }

    public getTbody(doc: Document) {
        // html
        const htmlNode = this.findFirstNodeInChildrenByName(doc, "html");
        // body
        const bodyNode = this.findFirstNodeInChildrenByName(htmlNode, "body");
        // section
        const sectionNode = this.findFirstNodeRecursivelyByName(bodyNode, "section");
        // div array
        const tableNode = this.findFirstNodeRecursivelyByName(sectionNode, "table");
        // tbody node
        const tbodyNode = this.findFirstNodeInChildrenByName(tableNode, "tbody");
        return tbodyNode;
    }

    private findFirstNodeRecursivelyByName(node: any, name: string) {
        if (node === null) {
            throw new Error("Node not found while looking for " + name);
        }
        if (node.nodeName === name) {
            return node;
        }
        if (node.childNodes === null) {
            return null;
        }
        for (const child of node.childNodes) {
            if (child.nodeName === "div" || child.nodeName === name) {
                const result: any = this.findFirstNodeRecursivelyByName(child, name);
                if (result !== null) {
                    return result;
                }
            }
        }
        return null;
    }

    private findFirstNodeInChildrenByName(node: any, name: string) {
        if (node === null) {
            throw new Error("Node not found while looking for " + name);
        }
        if (node.childNode === null) {
            return null;
        }
        for (const child of node.childNodes) {
            if (child.nodeName === name) {
                return child;
            }
        }
        return null;
    }
}