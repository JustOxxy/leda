import * as React from 'react';
import { RenderEvent } from '../../commonTypes';

export interface RejectedFileType extends File {
  errorCode?: number,
}

export interface FileLoadEvent {
  component: {
    value: {
      acceptedFiles: File[],
      rejectedFiles: RejectedFileType[],
    },
  },
}

export interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Разрешенные типы файлов, см. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#Attributes. Передача нескольких типов файлов происходит через запятую (.png, image/jpeg). allowedFiles и forbiddenFiles нельзя использовать вместе */
  allowedFiles?: string, // comma separated list of valid mime types: "image/*, application/pdf"
  /** Классы, применяемые к первому диву */
  className?: string,
  /** Описание компонента */
  infoRender?: (props: RenderEvent<FileUploadProps>) => React.ReactElement | React.FC,
  /** Запрещенные типы файлов. см. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#Attributes. Передача нескольких типов файлов происходит через запятую (.png, image/jpeg). allowedFiles и forbiddenFiles нельзя использовать вместе */
  forbiddenFiles?: string,
  /** Состояние загрузки */
  isLoading?: boolean,
  /** Максимальный размер файла в Мбайтах */
  maxFileSize?: number,
  /** Минимальный размер файла в байтах */
  minFileSize?: number,
  /** Обработчик клика */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
  /** Функция обратного вызова. Получает в качстве аргументов принятые файлы и отклоненные файлы с кодом ошибки (1 - файл меньше минимального размера, 2 - больше максимального, 3 - не удовлетворяет типу, 0 - неизвестная ошибка) */
  onFileLoad?: (event: FileLoadEvent) => void,
  ref?: React.Ref<FileUploadRefCurrent>,
  /** Обертка компонента */
  wrapperRender?: (props: RenderEvent<FileUploadProps, FileUploadProps>) => React.ReactElement | React.FC,
  /** Классы объявленные с _ */
  [x: string]: unknown,
}

export interface WrapperProps {
  className?: string,
  ref: React.Ref<FileUploadRefCurrent>,
  onClick: (ev: React.MouseEvent<HTMLDivElement>) => void,
}

export interface InfoProps {
  children: React.ReactNode,
}

export interface CustomElements {
  Wrapper: React.FC<WrapperProps>,
  Info: React.FC<InfoProps>,
}

export interface FileUploadRefCurrent {
  wrapper: HTMLElement | null,
}
