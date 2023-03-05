import { IEntity } from '@INTERFACE/common';

export const create =
  <T extends D, D>(creator: () => T) =>
  async (data: D): Promise<T> => {
    return { ...creator(), ...data };
  };

export const update =
  <T extends IEntity<string> & D, D extends object>(list: T[]) =>
  (data: D) =>
  async (_id: string) => {
    const target = list.find(({ id }) => id === _id);
    if (target === undefined) {
      return;
    }
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        (target as any)[key] = value;
      }
    }
    return;
  };

export const findOne =
  <T extends IEntity<string> & { is_deleted: boolean }>(list: T[]) =>
  (include_deleted = false) => {
    return async (_id: string) => {
      const target = list.find(({ id }) => id === _id);
      if (target === undefined) {
        return null;
      }
      if (include_deleted || !target.is_deleted) {
        return target;
      }
      return null;
    };
  };

export const save =
  <T extends IEntity<string>>(list: T[]) =>
  async (aggregate: T) => {
    const index = list.findIndex(({ id }) => id === aggregate.id);
    if (index === -1) {
      return aggregate;
    }
    list[index] = aggregate;
    return aggregate;
  };
