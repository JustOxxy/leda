import * as React from 'react';
import { isNil, isObject } from 'lodash';
import { LedaContext } from '../../components/LedaProvider';
import { Loader } from '../../components/Loader';
import { Div, DivRefCurrent } from '../../components/Div';
import { Li } from '../../components/Li';
import { Ul } from '../../components/Ul';
import { COMPONENTS_NAMESPACES } from '../../constants';
import { useAdaptivePosition, useElement, useTheme } from '../../utils';
import { scrollToSuggestion, groupData, getSuggestionItemProps } from './helpers';
import { SuggestionItem } from './SuggestionItem';
import { SuggestionListProps, GroupedSomeObject, Value } from './types';
import { NoSuggestions } from './NoSuggestions';

export const SuggestionList = (props: SuggestionListProps): React.ReactElement | null => {
  const {
    boundingContainerRef,
    canSelectAll,
    canSelectGroup,
    compareObjectsBy,
    data,
    groupBy,
    groupLabelRender,
    groupWrapperRender,
    hasCheckBoxes,
    highlightedSuggestion,
    selectedSuggestion,
    isLoading,
    isOpen,
    itemRender,
    listRender,
    noSuggestionsRender,
    onClick,
    placeholder,
    shouldAllowEmpty,
    textField,
    theme: themeProp,
    value,
  } = props;

  const theme = useTheme(themeProp, COMPONENTS_NAMESPACES.suggestionList);

  const { renders: { [COMPONENTS_NAMESPACES.suggestionList]: suggestionRenders } } = React.useContext(LedaContext);

  const List = useElement(
    'List',
    Ul,
    listRender || suggestionRenders.listRender,
    props,
  );

  const GroupLabel = useElement(
    'GroupLabel',
    Div,
    groupLabelRender || suggestionRenders.groupLabelRender,
    props,
  );

  const GroupWrapper = useElement(
    'GroupWrapper',
    Ul,
    groupWrapperRender || suggestionRenders.groupWrapperRender,
    props,
  );

  const NoSuggestionsComponent = useElement(
    'NoSuggestions',
    NoSuggestions,
    noSuggestionsRender || suggestionRenders.noSuggestionsRender,
    props,
  );

  const wrapperRef = React.useRef<DivRefCurrent | null>(null);

  const containerRef = React.useRef<HTMLElement | null>(null);
  const suggestionRef = React.useRef<HTMLElement | null>(null);

  const [resultedData, setResultedData] = React.useState<Value[] | GroupedSomeObject[]>([]);

  const classMap = React.useMemo(() => ({
    top: theme.containerTop,
    visible: theme.containerVisible,
  }), [theme.containerTop, theme.containerVisible]);

  useAdaptivePosition({
    elRef: wrapperRef,
    isOpen,
    classNames: classMap,
    boundingContainerRef,
  });

  React.useEffect((): void => {
    // скроллим эффективно
    scrollToSuggestion(containerRef, suggestionRef);
  }, [isOpen, value, selectedSuggestion, highlightedSuggestion]);

  // group suggestion list items if required
  React.useEffect((): void => {
    // grouping data

    setResultedData(groupData(data, groupBy));
  }, [data, groupBy, value]);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <Div className={theme.container} onMouseDown={(ev) => ev.preventDefault()} ref={wrapperRef}>
        <Loader />
      </Div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Div className={theme.container} onMouseDown={(ev) => ev.preventDefault()} ref={wrapperRef}>
        <NoSuggestionsComponent className={theme.noSuggestions} />
      </Div>
    );
  }

  const suggestions: (Value | GroupedSomeObject)[] = !isNil(placeholder) && shouldAllowEmpty
    ? [placeholder, ...resultedData]
    : resultedData;

  return (
    <Div className={theme.container} onMouseDown={(ev) => ev.preventDefault()} ref={wrapperRef}>
      <List
        className={theme.list}
        ref={(component) => {
          containerRef.current = component && component.wrapper;
        }}
      >
        {canSelectAll && (() => {
          const text = 'Выбрать все';
          const suggestionsCount = suggestions.reduce((accumulator: number, suggestion) => (
            (suggestion as GroupedSomeObject)?.dataItems
              ? (accumulator + (suggestion as GroupedSomeObject)?.dataItems?.length)
              : (accumulator + 1)), 0);

          const isSemi = (() => {
            if ((value as Value[]).length === 0) return false;

            // all nested checkboxes are checked
            return (value as Value[]).every((elem) => data?.includes(elem));
          })();

          const isSelectAllChosen = (value as Value[]).length === suggestionsCount;
          return (
            <SuggestionItem
              hasCheckBoxes={hasCheckBoxes}
              isChosen={isSemi}
              isSemi={!isSelectAllChosen && isSemi}
              isPlaceholder={false}
              isScrollTarget={false}
              item={text === placeholder ? null : text}
              itemRender={itemRender}
              key={text}
              onClick={onClick}
              suggestionRef={suggestionRef}
              text={text}
              textField={textField}
              theme={theme}
            />
          );
        })()}

        {suggestions?.map((suggestion: GroupedSomeObject | Value) => {
          if (!isNil((suggestion as GroupedSomeObject)?.key)) {
            const suggestionGroupLabelComputedProps = getSuggestionItemProps({
              compareObjectsBy,
              highlightedSuggestion,
              placeholder,
              selectedSuggestion,
              suggestion,
              textField,
              isGroupLabel: true,
              hasCheckBoxes,
            });
            // const key = isObject(suggestion) ? JSON.stringify(suggestion) : suggestion as string;
            const isGroupChosen = canSelectGroup && (suggestion as GroupedSomeObject)?.dataItems?.every((elem) => (value as Value[])?.includes(elem));
            const isSemi = (() => {
              if (!canSelectGroup) return false;

              // all nested checkboxes are checked
              return (suggestion as GroupedSomeObject)?.dataItems?.some((elem) => (value as Value[])?.includes(elem));
            })();

            return (
              <GroupWrapper className={theme.group}>
                <GroupLabel className={theme.groupLabel}>
                  {canSelectGroup
                    ? (
                      <SuggestionItem
                        isChosen={isSemi}
                        isSemi={!isGroupChosen && isSemi}
                        itemRender={itemRender}
                        onClick={onClick}
                        suggestionRef={suggestionRef}
                        textField={textField}
                        theme={theme}
                        // key={key}
                        {...suggestionGroupLabelComputedProps}
                      />
                    ) : (suggestion as GroupedSomeObject).key}
                </GroupLabel>

                {(suggestion as GroupedSomeObject)?.dataItems?.map((dataItem: Value) => {
                  const suggestionItemComputedProps = getSuggestionItemProps({
                    compareObjectsBy,
                    highlightedSuggestion,
                    placeholder,
                    selectedSuggestion,
                    suggestion: dataItem,
                    textField,
                    hasCheckBoxes,
                  });

                  const isChosen: boolean | undefined = canSelectGroup && (value as Value[])?.includes(dataItem);
                  // const keys = isObject(dataItem) ? JSON.stringify(dataItem) : dataItem as string;
                  return (
                    <SuggestionItem
                      isChosen={isChosen}
                      itemRender={itemRender}
                      onClick={onClick}
                      suggestionRef={suggestionRef}
                      textField={textField}
                      theme={theme}
                      // key={keys}
                      {...suggestionItemComputedProps}
                    />
                  );
                })}
              </GroupWrapper>
            );
          }

          const suggestionItemComputedProps = getSuggestionItemProps({
            compareObjectsBy,
            highlightedSuggestion,
            placeholder,
            selectedSuggestion,
            suggestion,
            textField,
            hasCheckBoxes,
          });

          const isItemChosen: boolean | undefined = (value as Value[])?.includes(suggestion);
          // const keyss = isObject(suggestion) ? JSON.stringify(suggestion) : suggestion as string;
          return (
            <SuggestionItem
              isChosen={isItemChosen}
              itemRender={itemRender}
              onClick={onClick}
              suggestionRef={suggestionRef}
              textField={textField}
              theme={theme}
              // key={keyss}
              {...suggestionItemComputedProps}
            />
          );
        })}
      </List>
    </Div>
  );
};

SuggestionList.displayName = 'SuggestionList';
