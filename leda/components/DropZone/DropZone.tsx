import React, { Fragment } from 'react';
import { DropzoneOptions, DropzoneRef, useDropzone } from 'react-dropzone';
import {
  mergeClassNames, getClassNames, bindFunctionalRef, useTheme,
} from '../../utils';
import { MAX_FILE_SIZE, MIN_FILE_SIZE } from '../../constants';
import { Div } from '../Div';
import { DescriptionMessage, getRestProps } from './helpers';
import { createChangeHandler, createClickHandler } from './handlers';
import { DropZoneFiles } from './DropZoneFiles';
import { RejectedFilesList } from './RejectedFilesList';
import * as messages from '../../messages';
import { DropZoneProps, DropZoneRefCurrent, DropZoneState } from './types';
import { useCustomElements } from './hooks';

export const DropZone = React.forwardRef((props: DropZoneProps, ref: React.Ref<DropZoneRefCurrent>): React.ReactElement => {
  const {
    allowedFiles,
    className,
    dropZoneFilesNode,
    forbiddenFiles,
    isDisabled,
    maxFileSize = MAX_FILE_SIZE,
    maxFilesNumber,
    minFileSize = MIN_FILE_SIZE,
    value: valueProps,
  } = mergeClassNames<DropZoneProps>(props);


  const dropZoneRef = React.useRef<DropzoneRef | null>(null);

  const theme = useTheme(props.theme, 'dropZone');

  const [stateValue, setStateValue] = React.useState<DropZoneState>({
    rejectedFiles: [],
    acceptedFiles: [],
  });

  const value = valueProps || stateValue;

  const handleChange = createChangeHandler(props, stateValue, setStateValue);

  const handleClick = createClickHandler(props, stateValue, dropZoneRef);

  const combinedClassNames = getClassNames(className, theme.wrapper, { [theme.disabled]: isDisabled });

  const combinedButtonClassNames = getClassNames(theme.button, { [theme.disabled]: isDisabled });

  const combinedContentClassNames = getClassNames(theme.content, { [theme.disabled]: isDisabled });

  const singleMode = maxFilesNumber && maxFilesNumber <= 1;

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: handleChange as DropzoneOptions['onDrop'],
    accept: allowedFiles,
    maxSize: maxFileSize,
    multiple: !singleMode,
    disabled: isDisabled,
  });

  dropZoneRef.current = { open };

  const {
    AcceptedFiles, RejectedFiles, Info, UploadButton, Wrapper,
  } = useCustomElements(props, stateValue);

  const rootProps = getRootProps();

  const inputProps = { ...getRestProps(props), ...getInputProps() };

  return (
    <>
      <Wrapper
        className={combinedClassNames}
        ref={ref && ((component) => bindFunctionalRef(component, ref, component && {
          wrapper: component.wrapper,
          input: component.wrapper && component.wrapper.querySelector('input'),
        }))}
      >
        <Div
          {...rootProps}
          onClick={handleClick}
          className={combinedContentClassNames}
          ref={(component) => {
            rootProps.ref.current = component ? component.wrapper : null;
          }}
        >
          <input {...inputProps} />
          <UploadButton
            className={combinedButtonClassNames}
          >
            Выбрать...
          </UploadButton>
          {' '}
          <Info className={theme.description}>
            <DescriptionMessage>
              Перетащите сюда файлы для загрузки.
            </DescriptionMessage>
            {' '}
            <DescriptionMessage>
              {messages.getFileSizeDescription(minFileSize, maxFileSize, 'byte')}
            </DescriptionMessage>
            {' '}
            <DescriptionMessage>
              {messages.getMaxFilesDescription(maxFilesNumber)}
            </DescriptionMessage>
            {' '}
            <DescriptionMessage>
              {messages.getFormatsDescription(allowedFiles)}
            </DescriptionMessage>
            {' '}
            <DescriptionMessage>
              {messages.getForbiddenFormatsDescription(forbiddenFiles)}
            </DescriptionMessage>
          </Info>
        </Div>
      </Wrapper>
      <RejectedFiles
        className={theme.rejectedFilesWrapper}
      >
        <RejectedFilesList
          maxFilesNumber={maxFilesNumber}
          theme={theme}
          value={value}
        />
      </RejectedFiles>
      <AcceptedFiles
        dropZoneFilesNode={dropZoneFilesNode}
        onChange={handleChange}
      >
        <DropZoneFiles
          files={value.acceptedFiles}
          onChange={handleChange}
          shouldRender={value.acceptedFiles.length > 0}
          theme={theme}
          value={value}
        />
      </AcceptedFiles>
    </>
  );
}) as React.FC<DropZoneProps>;

DropZone.displayName = 'DropZone';
