import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import { parseDateString } from '../Client/Client.helpers';
import File from '../File/File';
import { DocumentFile } from './Document.interfaces';
import { DocumentFileXMLObject, DocumentXMLObject } from './Document.xml';

export default class Document extends File<DocumentFile[]> {
  public readonly file: {
    name: string;
    date: Date;
    type: string;
  };

  public readonly comment: string;
  protected parseXMLObject(xmlObject: DocumentFileXMLObject) {
    return xmlObject.StudentAttachedDocumentData[0].DocumentDatas[0].DocumentData.map(
      (document) => ({
        file: {
          name: document['@_FileName'][0],
          type: document['@_DocType'][0],
          date: parseDateString(document['@_DocDate'][0]),
        },
        category: document['@_Category'][0],
        notes: document['@_Notes'][0],
        base64: document.Base64Code[0],
      })
    );
  }
  public constructor(
    xmlObj: DocumentXMLObject['StudentDocuments'][0]['StudentDocumentDatas'][0]['StudentDocumentData'][0],
    credentials: LoginCredentials
  ) {
    super(credentials, xmlObj['@_DocumentGU'][0], 'GetContentOfAttachedDoc');

    /**
     * The properties of the file
     * @public
     * @readonly
     * @property {string} name The name of the file
     * @property {string} type The file type
     * @property {Date} date The date the file was created
     */
    this.file = {
      name: xmlObj['@_DocumentFileName'][0],
      type: xmlObj['@_DocumentType'][0],
      date: parseDateString(xmlObj['@_DocumentDate'][0]),
    };

    /**
     * The comment included in the document
     * @public
     * @readonly
     * @type {string}
     */
    this.comment = xmlObj['@_DocumentComment'][0];
  }
}
