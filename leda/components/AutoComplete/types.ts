import * as React from 'react';
import { FILTER_RULES } from '../../utils';
import { ValidationProps } from '../Validation/types';
import { CustomRender, Values } from '../../commonTypes';
import { LiProps } from '../Li';
import { SuggestionItemProps, SuggestionListProps } from '../../src/SuggestionList/types';
import { UlProps } from '../Ul';
import { PartialGlobalDefaultTheme } from '../../utils/useTheme';
import { COMPONENTS_NAMESPACES } from '../../constants';

/** DataObject - обьект с данными для отображения в выпадающем списке
 * Обьект должен содержать минимум одно поле (TextField), название которого передаётся через атрибут textField
 * его значение должно быть строкой, используется для отображения
 *
 * см. примеры в документации
 * */

export interface DataObject {
  [textField: string]: any,
}

export type Suggestion = DataObject | string | number | null;

// Значения, которые приходят в onChange, помогают определить, какое событие вызвало срабатывание onChange
export enum CHANGE_METHOD {
  type = 'type', // ввод символа с клавиатуры
  click = 'click', // клик по элементу в выпадающем списке
  enter = 'enter', // нажатие на enter при выборе элемента в выпадающем списке с клавиатуры
  trigger = 'trigger', // программный вызвов onChange
  up = 'up', // нажатие вверх при переходе по выпадающему списку с клавиатуры
  down = 'down', // нажатие вниз при переходе по выпадающему списку с клавиатуры
  escape = 'escape', // нажатие escape
  clear = 'clear', // клик по иконке закрытия в инпуте
  reset = 'reset', // сборс значения
}

export interface KeyboardChangeEvent<T extends Suggestion> extends React.KeyboardEvent<HTMLElement> {
  component: {
    value: string,
    method: CHANGE_METHOD.enter | CHANGE_METHOD.down | CHANGE_METHOD.up,
    name?: string,
    suggestion?: T,
  },
}

export interface MouseChangeEvent<T extends Suggestion> extends React.MouseEvent<HTMLElement> {
  component: {
    value: string,
    method: CHANGE_METHOD.click | CHANGE_METHOD.clear,
    name?: string,
    suggestion?: T,
  },
}

export interface TypeChangeEvent<T extends Suggestion> extends React.ChangeEvent<HTMLInputElement> {
  component: {
    value: string,
    method: CHANGE_METHOD.type,
    name?: string,
    suggestion?: T,
  },
}

export interface TriggerChangeEvent<T extends Suggestion> extends React.FocusEvent<HTMLInputElement> {
  component: {
    value: string,
    method: CHANGE_METHOD.trigger,
    name?: string,
    suggestion?: T,
  },
}

export interface ResetChangeEvent<T extends Suggestion> {
  component: {
    value: string,
    method: CHANGE_METHOD.reset,
    name?: string,
    suggestion?: T,
  },
}

export type ChangeEvent<T extends Suggestion = Suggestion> = TypeChangeEvent<T> | KeyboardChangeEvent<T> | MouseChangeEvent<T> | TriggerChangeEvent<T> | ResetChangeEvent<T>;

export interface FocusEvent extends React.FocusEvent<HTMLInputElement> {
  component: {
    value: string,
    name?: string,
  },
}

export interface BlurEvent extends React.FocusEvent<HTMLInputElement> {
  component: {
    isValid: boolean,
    name?: string,
    value: string,
  },
}

export interface AutoCompleteProps<T extends Suggestion = Suggestion> extends ValidationProps {
  compareObjectsBy?: T extends object ? ((suggestionListItem: T) => any) | string : never,
  /** Данные для отображения в выпадающем списке */
  data: T[],
  /** Отключить ввод в инпуте компонента  */
  isDisabled?: boolean,
  /** Фильтр данных по правилу. smart (дефолтное значение) "умный" поиск, startsWith - фильтр по началу строку в инпуте, includes - поиск по вхождению. Не желательно использовать "умный" поиск при больших обьемах данных(1-2 тысячи значений) */
  filterRule?: 'smart' | 'startsWith' | 'includes',
  /** Футер под значениями в выпадающем списке */
  footerRender?: () => React.ReactNode,
  /** Ключ для группировки */
  groupBy?: (option: T) => string | undefined,
  /** Хедер над значениями в выпадающем списке */
  headerRender?: () => React.ReactNode,
  /** Отображение кнопки для очистки значения в инпуте */
  hasClearButton?: boolean,
  /** Вместо выпадающего списка в момент загрузки будет отображаться лоадер - полезно при подгрузке данных для списка с сервера */
  isLoading?: boolean,
  /** Рендерить компонент с открытым выпадающим списком */
  isOpen?: boolean,
  /** Кастомизация внешнего вида элемента выпадающего списка. */
  itemRender?: CustomRender<SuggestionItemProps, {}, LiProps>,
  /** Обязательное поле или нет */
  isRequired?: boolean,
  /** Кастомизация внешнего вида выпадающего списка. */
  listRender?: CustomRender<SuggestionListProps, {}, UlProps>,
  /** Количество символов в инпуте после которых начать показывать выпадающий список */
  minSearchLength?: number,
  /** Имя поля ввода */
  name?: string,
  /** Принимает JSX */
  noSuggestionsRender?: SuggestionListProps['noSuggestionsRender'],
  /** Обработчик события потери фокуса */
  onBlur?: (event: BlurEvent) => void,
  /** Обработчик события изменения значения в инпуте */
  onChange: (event: ChangeEvent<T>) => void,
  /** Обработчик события фокуса */
  onFocus?: (event: FocusEvent) => void,
  /** Плейсхолдер */
  placeholder?: string,
  /** При потере фокуса проверяет введенное значение на соответствие значениям в data и подставляет последнее корректное (есть в data) или пустое значение */
  shouldCorrectValue?: boolean,
  /** Показывать все элементы из data, не фильтруя */
  shouldShowAllSuggestions?: boolean,
  /** Поля, в которых содержатся данные для поиска */
  searchFields?: string[],
  /** Устанавливает поле из data, которое будет использоваться для отображения если передан объект. Значение в поле объекта также должно быть типом string. Если data - массив примитивов, не задавайте эту настройку */
  textField?: T extends object ? string : never,
  /** Реф */
  ref?: React.Ref<AutoCompleteRefCurrent>,
  /** Тема */
  theme?: PartialGlobalDefaultTheme[typeof COMPONENTS_NAMESPACES.autoComplete],
  /** Значение компонента */
  value?: string | null,
  /** Классы переданные через _ */
  [x: string]: unknown,
}

export interface SuggestionsVal {
  data: Suggestion[],
  textField?: string,
  value?: string | null,
  filterRule?: Values<typeof FILTER_RULES>,
  isOpen?: boolean,
  minSearchLength?: number,
  shouldShowAllSuggestions?: boolean,
  searchFields?: string[],
}

export interface AutoCompleteRefCurrent {
  wrapper: HTMLElement | null,
  input: HTMLInputElement | null,
}
