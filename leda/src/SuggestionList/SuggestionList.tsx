import * as React from 'react';
import { isNil } from 'lodash';
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
    compareObjectsBy,
    data,
    groupBy,
    groupLabelRender,
    groupWrapperRender,
    hasCheckboxes,
    highlightedSuggestion,
    selectedSuggestion,
    isClickableGroup,
    isLoading,
    isOpen,
    isSelectAllButton,
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
    Li,
    groupLabelRender || suggestionRenders.groupLabelRender,
    props,
  );

  const GroupWrapper = useElement(
    'GroupWrapper',
    Div,
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
        {isSelectAllButton && (() => {
          const text = 'Выбрать все';
          const suggestionsCount = suggestions.reduce((accumulator: number, suggestion) => ((suggestion as GroupedSomeObject)?.dataItems ? (accumulator + (suggestion as GroupedSomeObject)?.dataItems?.length) : (accumulator + 1)), 0);
          const isSemi = (value as Value[])?.length > 0 && (value as Value[])?.every((elem) => data?.includes(elem));
          const isSelectAllChoosed = (value as Value[])?.length === suggestionsCount;
          return (
            <SuggestionItem
              hasCheckboxes={hasCheckboxes}
              isChoosed={isSemi}
              isSemi={!isSelectAllChoosed && isSemi}
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
              hasCheckboxes,
            });

            const isGroupChoosed = isClickableGroup && (suggestion as GroupedSomeObject)?.dataItems?.every((elem) => (value as Value[])?.includes(elem));
            const isSemi: boolean | undefined = isClickableGroup && (suggestion as GroupedSomeObject)?.dataItems?.some((elem) => (value as Value[])?.includes(elem));

            return (
              <GroupWrapper className={theme.group}>
                <GroupLabel className={theme.groupLabel}>
                  {isClickableGroup
                    ? (
                      <SuggestionItem
                        isChoosed={isSemi}
                        isSemi={!isGroupChoosed && isSemi}
                        itemRender={itemRender}
                        onClick={onClick}
                        suggestionRef={suggestionRef}
                        textField={textField}
                        theme={theme}
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
                    hasCheckboxes,
                  });

                  const isChoosed: boolean | undefined = isClickableGroup && (value as Value[])?.includes(dataItem);

                  return (
                    <SuggestionItem
                      isChoosed={isChoosed}
                      itemRender={itemRender}
                      onClick={onClick}
                      suggestionRef={suggestionRef}
                      textField={textField}
                      theme={theme}
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
            hasCheckboxes,
          });

          const isItemChoosed: boolean | undefined = isClickableGroup && (value as Value[])?.includes(suggestion);

          return (
            <SuggestionItem
              isChoosed={isItemChoosed}
              itemRender={itemRender}
              onClick={onClick}
              suggestionRef={suggestionRef}
              textField={textField}
              theme={theme}
              {...suggestionItemComputedProps}
            />
          );
        })}
      </List>
    </Div>
  );
};

SuggestionList.displayName = 'SuggestionList';
