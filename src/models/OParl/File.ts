import { Document, model, Schema } from 'mongoose';
import { optionalStringArray } from '../modelHelpers';
import { OParlBase, oParlBaseSchema } from './OParlBase';

export interface IFile extends OParlBase {
  name?: string;
  fileName?: string;
  mimeType?: string;
  date?: Date;
  size?: number;
  sha1Checksum?: string;
  sha512Checksum?: string;
  text?: string;
  accessUrl: string;
  downloadUrl?: string;
  externalServiceUrl?: string;
  masterFile?: string; // externalId of a file
  derivativeFile?: string[]; // array of externalIds of the file objects
  fileLicense?: string;
  meeting?: string[]; // array of externalIds of the meeting objects
  agendaItem?: string[]; // array of externalIds of the agenda item objects
  paper?: string[]; // array of externalIds of the paper objects
}

export interface IFileSchema extends IFile, Document {}

// this should always match the interface from above
const FileSchema = new Schema<IFileSchema>(
  Object.assign(oParlBaseSchema(), {
    name: String,
    fileName: String,
    mimeType: String,
    date: Date,
    size: Number,
    sha1Checksum: String,
    sha512Checksum: String,
    text: String,
    accessUrl: { type: String, required: true },
    downloadUrl: String,
    externalServiceUrl: String,
    masterFile: String,
    derivativeFile: optionalStringArray,
    fileLicense: String,
    meeting: optionalStringArray,
    agendaItem: optionalStringArray,
    paper: optionalStringArray,
  }),
);

export const File = model<IFileSchema>('File', FileSchema);
