import * as React from 'react';
import { SomeObject } from '../../../leda/commonTypes';
import * as L from '../../../leda';
import { StateButtonGroup } from '../StateButtonGroup';

export const DataTypes = (args: SomeObject): React.ReactElement => {
  const [props, setProps] = React.useState({});
  const [isOpen, setIsOpen] = React.useState<boolean | undefined>();
  const [isDisabled, setIsDisabled] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string | number | SomeObject | null>(null);

  return (
    <L.Div _box _inner _demoBg>
      <L.DropDownSelect
        data={[
          'London',
          'Islamabad',
          'Berlin',
          'Washington',
          'Paris',
          'Rome',
          'Tokyo',
          'Budapest',
          'Ottawa',
          'Moscow',
        ]}
        hasClearButton
        data-test="dropdownselect"
        defaultValue="London"
        _width40
        isOpen={isOpen}
        isLoading={isLoading}
        isDisabled={isDisabled}
        value={value}
        onChange={ev => {
          console.log('ev.component', ev.component);
          setValue(ev.component.value);
        }}
        onBlur={ev => {
          console.log('ev.component.value', ev.component.value);
        }}
        {...props}
      >
      </L.DropDownSelect>
      <br />
      <br />
      <StateButtonGroup
        data={[
          {
            text: 'String data',
            props: {
              data: [
                'London',
                'Islamabad',
                'Berlin',
                'Washington',
                'Paris',
                'Rome',
                'Tokyo',
                'Budapest',
                'Ottawa',
                'Moscow',
              ],
              key: 'string-data',
            },
          },
          {
            text: 'Object data',
            props: {
              data: [
                { txt: 'London', val: 1 },
                { txt: 'Islamabad', val: 2 },
                { txt: 'Berlin', val: 3 },
                { txt: 'Washington', val: 4 },
                { txt: 'Paris', val: 5 },
                { txt: 'Rome', val: 6 },
              ],
              textField: 'txt',
              defaultValue: { txt: 'London', val: 1 },
              key: 'object-data',
            },
          },
        ]}
        setProps={setProps}
      />
      <br />
      <br />
      <L.Button _warning={isDisabled} onClick={() => setIsDisabled(!isDisabled)}>Toggle isDisabled</L.Button>
      {' '}
      <L.Button _warning={isLoading} onClick={() => setIsLoading(!isLoading)}>Toggle isLoading</L.Button>
      {' '}
      <L.Button _warning={isOpen} onClick={() => setIsOpen(isOpen ? undefined : true)}>Toggle isOpen</L.Button>
    </L.Div>
  );
};
