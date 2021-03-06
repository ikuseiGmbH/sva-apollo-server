import { fetch } from 'apollo-env';

import {
  appendURIParams,
  formatCreatedSince,
  formatCreatedUntil,
} from '../../helpers';

// if performance becomes problematic: improve importing of paginated lists -> import/update entries directly as they are already available

// fetch all entries and of a paginated list and extract the ids
export const fetchPaginatedOParlList = async (
  startUrl: string,
  createdSince?: Date,
  createdUntil?: Date,
) => {
  let next: string | undefined = appendURIParams(
    startUrl,
    formatCreatedSince(createdSince),
    formatCreatedUntil(createdUntil),
  );

  const result: unknown[] = [];

  while (next) {
    try {
      const response = await (await fetch(next)).json();

      console.log(next);

      if (response?.data?.length) {
        result.push(...response.data);
      }

      next = response?.links?.next;
    } catch (e) {
      console.log(`Error while fetching paginated OParl list from ${next}:`, e);
      next = undefined;
    }
  }

  return result;
};
