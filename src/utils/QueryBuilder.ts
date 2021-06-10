// import { firestore } from 'firebase/app';
import {
  Query,
  getDocs,
  QuerySnapshot,
  where,
  query as queryOrig,
  orderBy as orderByOrig,
  startAt as startAtOrig,
  startAfter as startAfterOrig,
  endAt as endAtOrig,
  endBefore as endBeforeOrig,
  limit as limitOrig,
} from "firebase/firestore";
// import { Query } from "../Query";

import { IEntity, ICollectionQuery, ICollection, IFieldMeta } from "../types";

/**
 * Utility functions to build firestore-compatiable queries.
 */
export default class QueryBuilder {
  /**
   * Converts a firestom query into a firestore query.
   * @param collectionRef The native firestore collection reference.
   * @param query The firestorm query
   */
  public static query<T extends IEntity>(
    collection: ICollection<T>,
    fields: Map<string, IFieldMeta>,
    query: ICollectionQuery<T>
  ): Query {
    const collectionRef = collection.native;
    const queryInit = queryOrig(collectionRef);
    const {
      where: whereQueries,
      orderBy: orderByQueries,
      startAfter: startAfterQuery,
      startAt: startAtQuery,
      endAt: endAtQuery,
      endBefore: endBeforeQuery,
      limit: limitQuery,
    } = query;
    let q = (whereQueries || []).reduce((accum: Query, curr): Query => {
      const [property, operator, value] = curr;
      const field = fields.get(property as string);
      if (field) {
        return queryOrig(accum, where(field.name, operator, value));
      }
      throw new Error(
        `Could not find property ${property} in collection ${collection.path}`
      );
    }, queryInit);

    if (orderByQueries) {
      orderByQueries.forEach((obq): void => {
        q = queryOrig(q, orderByOrig(obq[0] as string, obq[1] || "asc"));
      });
      if (startAtQuery || startAfterQuery) {
        let addedStartAt = false;
        if (startAtQuery) {
          addedStartAt = true;
          q = queryOrig(q, startAtOrig(startAtQuery));
        }
        if (startAfterQuery && !addedStartAt) {
          q = queryOrig(q, startAfterOrig(startAtQuery));
        }
      }
      if (endAtQuery || endBeforeQuery) {
        let addedEndAt = false;
        if (endAtQuery) {
          addedEndAt = true;
          q = queryOrig(q, endAtOrig(endAtQuery));
        }
        if (endBeforeQuery && !addedEndAt) {
          q = queryOrig(q, endBeforeOrig(endBeforeQuery));
        }
      }
    }

    if (limitQuery) {
      q = queryOrig(q, limitOrig(limitQuery));
    }
    return q;
  }
  public static async get<T>(query: Query<T>): Promise<QuerySnapshot<T>> {
    return await getDocs(query);
  }
}
