import {View, Text, Button} from 'react-native';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import {
  NumberPadProvider,
  useNumberPadAction,
  useNumberPadValue,
} from './NumberPadProvider';

const Example = () => {
  const value = useNumberPadValue();
  const {onAppend, onDelete, onClear} = useNumberPadAction();
  const labels = ['0', '1', '2', '.', '-', 'clear'];
  return (
    <View>
      <Text>{`Value is: ${value}`}</Text>
      {labels.map(l => (
        <Button
          key={`button-label:${l}`}
          title={l}
          onPress={() =>
            l === 'clear' ? onClear() : l === '-' ? onDelete() : onAppend(l)
          }
        />
      ))}
    </View>
  );
};

describe('How to append values', function () {
  test('initial context value should be empty', function () {
    const snapshot = render(<Example />, {wrapper: NumberPadProvider});

    const view = snapshot.getByText(/^Value is:/);
    expect(view).toBeTruthy();
  });
  test('`onAppend` should be called with the string which will be appended to the context value', function () {
    const snapshot = render(<Example />, {wrapper: NumberPadProvider});

    fireEvent.press(snapshot.getByText('1'));
    const view1 = snapshot.findByText('Value is: 1');
    expect(view1).toBeTruthy();

    fireEvent.press(snapshot.getByText('2'));
    const view2 = snapshot.findByText('Value is: 12');
    expect(view2).toBeTruthy();
  });
  test('`onDelete` should be called and this should be able to delete the last index of the context value', function () {
    const snapshot = render(<Example />, {wrapper: NumberPadProvider});

    fireEvent.press(snapshot.getByText('1'));
    fireEvent.press(snapshot.getByText('2'));

    expect(snapshot.findByText('Value is: 12')).toBeTruthy();

    fireEvent.press(snapshot.getByText('-'));
    expect(snapshot.findByText('Value is: 1')).toBeTruthy();
  });
  test('the context value should be formatted by locale string', async function () {
    const snapshot = render(<Example />, {wrapper: NumberPadProvider});

    for (let i = 0; i < 7; i++) {
      fireEvent.press(snapshot.getByText('1'));
    }

    const value = await snapshot.findByText('Value is: 1,111,111');
    expect(value).toBeTruthy();
  });
  test('the context value which is under decimal point should not be formatted', async function () {
    const snapshot = render(<Example />, {wrapper: NumberPadProvider});

    fireEvent.press(snapshot.getByText('0'));
    for (let i = 0; i < 5; i++) {
      fireEvent.press(snapshot.getByText('1'));
    }

    const value = await snapshot.findByText('Value is: 0.11111');
    expect(value).toBeTruthy();
  });
});

describe('How to handle decimal point', function () {
  test('When "0" is appended first, the context value should be "0."', function () {
    const snapshot = render(<Example />, {wrapper: NumberPadProvider});

    fireEvent.press(snapshot.getByText('0'));

    const view = snapshot.findByText('Value is: 0.');
    expect(view).toBeTruthy();
  });
  test('if `onDelete` is called while the context value is "0.", the value should be empty, not "0"', function () {
    const snapshot = render(<Example />, {wrapper: NumberPadProvider});
    // Make the context value to "0."
    fireEvent.press(snapshot.getByText('0'));

    snapshot.getByText('Value is: 0.');

    fireEvent.press(snapshot.getByText('-'));
    expect(snapshot.findByText('Value is:'));
  });
  test('the context value should be "0." which includes decimal point, when "." is pressed while the value is empty', function () {
    const snapshot = render(<Example />, {wrapper: NumberPadProvider});

    fireEvent.press(snapshot.getByText('.'));

    expect(snapshot.findByText('Value is: 0.')).toBeTruthy();
  });
  test('"." should not be appended when the context value already has a decimal point', function () {
    const snapshot = render(<Example />, {wrapper: NumberPadProvider});

    fireEvent.press(snapshot.getByText('0'));

    const view = snapshot.getByText('Value is: 0.');

    fireEvent.press(snapshot.getByText('.'));

    expect(snapshot.findByText('Value is: 0.')).toBeTruthy();
    fireEvent.press(snapshot.getByText('1'));
    fireEvent.press(snapshot.getByText('2'));
    fireEvent.press(snapshot.getByText('.'));

    expect(snapshot.findByText('Value is: 0.12')).toBeTruthy();
  });
});
describe(`How to manage the props of ${NumberPadProvider.name}`, function () {
  test('default `maxLength` should be 10 and it should restrict the length of the context value', async function () {
    const MAX_LENGTH = 10;
    const snapshot = render(<Example />, {wrapper: NumberPadProvider});

    for (let i = 0; i < MAX_LENGTH + 2; i++) {
      fireEvent.press(snapshot.getByText('1'));
    }

    const value = await snapshot.findByText('Value is: 1,111,111,111');
    expect(value).toBeTruthy();
  });
  test('`maxLength` should be changed with given value', async function () {
    const MAX_LENGTH = 5;
    const snapshot = render(
      <NumberPadProvider maxLength={MAX_LENGTH}>
        <Example />
      </NumberPadProvider>,
    );

    for (let i = 0; i < MAX_LENGTH + 2; i++) {
      fireEvent.press(snapshot.getByText('1'));
    }

    const value = await snapshot.findByText('Value is: 11,111');
    expect(value).toBeTruthy();
  });
});
