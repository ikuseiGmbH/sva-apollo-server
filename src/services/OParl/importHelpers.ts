import { fetch } from 'apollo-env';
import { isArray, isString } from 'lodash';

import { isStringArray } from '../../helpers';
import { OParlModel } from '../../models';
import { ImportQueue, ImportQueueEntry, ImportType } from './ImportTypes';
import { updateKeywords } from './keywords';

// we expect the input to be either a json object already, or a reference to a json object
// if the value is a string we interpret it as a reference and fetch the corresponding json
// otherwise we just return the value, because we assume it already is a json object
export const getJson = async (value: unknown) => {
  if (isString(value)) {
    try {
      const response = await fetch(value);

      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.log(`Error while fetching ${value}:`, e);
      return;
    }
  }

  return { ...(value as Record<string, unknown>) };
};

export const updateOrCreateEntry = async (
  json: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseJson: (json: Record<string, unknown>) => any,
  model: OParlModel,
  addToQueue?: [ImportQueueEntry | ImportQueueEntry[], ImportType][],
  queue?: ImportQueue,
) => {
  const parsedJson = parseJson(json);

  let entry = isString(parsedJson.externalId)
    ? await model.findOne({
        externalId: parsedJson.externalId,
      })
    : undefined;

  if (entry) {
    entry.overwrite(parsedJson);
  } else {
    entry = new model(parsedJson);
  }

  await entry.validate();

  // add list of oparl objects to import queue after the whole entry is validated
  addToQueue?.forEach((newEntry) => {
    if (isArray(newEntry[0])) {
      queue?.add(
        ...newEntry[0].map(
          (arrayEntry) =>
            [arrayEntry, newEntry[1]] as [ImportQueueEntry, ImportType],
        ),
      );
    } else {
      queue?.add([newEntry[0], newEntry[1]]);
    }
  });

  if (isStringArray(json.keyword) && json.keyword.length) {
    await updateKeywords(model, json.keyword);
  }

  return entry.save();
};
