import { Document, model, Schema } from 'mongoose';
import AutoPopulate from 'mongoose-autopopulate';

const CycleSchema = new Schema(
  {
    value: { type: Boolean, required: true },
    next: { type: Boolean, required: true },
  },
  { toJSON: { virtuals: true } },
);

CycleSchema.virtual('cycle', {
  ref: 'Cycle', // The model to use
  localField: 'next', // Find people where `localField`
  foreignField: 'value', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
  autopopulate: true,
});

CycleSchema.plugin(AutoPopulate);

export const Cycle = model<{ value: boolean } & Document>('Cycle', CycleSchema);

const ListEntrySchema = new Schema({
  value: { type: String, required: true },
});

const ListSchema = new Schema(
  {
    value: { type: String, required: true },
    next: [ListEntrySchema],
  },
  { toJSON: { virtuals: true } },
);

ListSchema.virtual('asd', {
  ref: 'List', // The model to use
  localField: 'next.value', // Find people where `localField`
  foreignField: 'value', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  autopopulate: true,
});

ListSchema.plugin(AutoPopulate);

export const List = model<{ value: string; next: string[] } & Document>(
  'List',
  ListSchema,
);
