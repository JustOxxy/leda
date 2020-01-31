import * as React from 'react';
import { isObject, isNil } from 'lodash';
import { Value } from '../../components/DropDownSelect/types';
import { SomeObject } from '../../commonTypes';
import { GroupedSomeObject } from './types';

export const getText = (suggestion?: string | number | SomeObject | null, textField?: string): string => {
  if (!suggestion) return '';

  if (!textField) return suggestion.toString();

  return isObject(suggestion) ? (suggestion[textField] as string | number | undefined || '').toString() : suggestion.toString();
};

export const scrollToSuggestion = (
  containerRef: React.MutableRefObject<HTMLElement | null>,
  suggestionRef: React.MutableRefObject<HTMLElement | null>,
): void => {
  if (!containerRef.current || !suggestionRef.current) return;

  const suggestionRect = suggestionRef.current.getBoundingClientRect();

  const containerRect = containerRef.current.getBoundingClientRect();

  const padding = 2;

  const offset = (() => {
    if (suggestionRect.top < containerRect.top) {
      return suggestionRect.top - containerRect.top - padding;
    }
    if (containerRect.bottom < suggestionRect.bottom) {
      return suggestionRect.bottom - containerRect.bottom + padding;
    }
    return 0;
  })();

  if (offset) containerRef.current.scrollBy?.(0, offset);
};

export const groupData = (data: Value[] | undefined, groupBy: (option: Value) => string | undefined): Value[] | GroupedSomeObject[] => {
  // used to keep track of key and indexes in the result array
  const indexByKey = new Map();
  let currentResultIndex = 0;
  return data?.reduce((accumulator: Value[] | GroupedSomeObject[], dataItem: Value) => {
    const key = groupBy ? groupBy(dataItem) : undefined;
    if (!isNil(key)) {
      if (indexByKey.get(key) === undefined) {
        indexByKey.set(key, currentResultIndex);
        accumulator.push({
          key,
          dataItems: [],
        });
        currentResultIndex += 1;
      }
      (accumulator[indexByKey.get(key)] as GroupedSomeObject).dataItems.push(dataItem as SomeObject);
    } else {
      (accumulator as Value[]).push(dataItem);
    }
    return accumulator;
  }, []) ?? [];
};
