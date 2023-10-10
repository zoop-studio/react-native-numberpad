import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type NumberPadValue = string;
type NumberPadValueContextType = NumberPadValue;
type NumberPadActionContextType = {
  onAppend(value: string): void;
  onDelete(): void;
  onClear(): void;
  getValue(): NumberPadValue;
};
const defaultValue: NumberPadValueContextType = '';
const NumberPadValueContext =
  createContext<NumberPadValueContextType>(defaultValue);
const NumberPadActionContext = createContext<NumberPadActionContextType>({
  onAppend() {},
  onDelete() {},
  onClear() {},
  getValue() {
    return '';
  },
});

export interface NumberPadProps {
  children: ReactNode;
  maxLength?: number;
}

export const NumberPadProvider = ({
  children,
  maxLength = 10,
}: NumberPadProps) => {
  const [stacks, setStacks] = useState<Array<string>>([]);

  const value: string = useMemo(() => {
    const idx = stacks.findIndex(v => v === '.');
    const prevValue = stacks.join('');

    if (prevValue === '') {
      return prevValue;
    }

    if (idx > -1) {
      const a = stacks.slice(0, idx).join('');
      const b = stacks.slice(idx + 1).join('');
      return `${Number.parseInt(a, 10).toLocaleString()}.${b}`;
    }
    return Number.parseFloat(prevValue).toLocaleString();
  }, [stacks]);
  const handleAppend: NumberPadActionContextType['onAppend'] = (
    stack: string,
  ) => {
    const prevValue = stacks.join('');

    if (prevValue.length >= maxLength) {
      return;
    }

    switch (stack) {
      case '.':
        if (prevValue === '') {
          setStacks(['0', stack]);
          break;
        }
        if (prevValue.includes('.')) {
          break;
        }
      case '0':
        if (prevValue === '') {
          setStacks([stack, '.']);
          break;
        }
      default:
        setStacks([...stacks, stack]);
        break;
    }
  };
  const handleClear: NumberPadActionContextType['onClear'] = useCallback(() => {
    setStacks([]);
  }, []);
  const handleDelete: NumberPadActionContextType['onDelete'] =
    useCallback(() => {
      if (stacks.length === 2 && stacks[0] === '0' && stacks[1] === '.') {
        handleClear();
        return;
      }
      const newStacks = [...stacks];
      newStacks.pop();
      setStacks(newStacks);
    }, [handleClear, stacks]);
  const handleGetValue: NumberPadActionContextType['getValue'] = () => {
    return value;
  };
  return (
    <NumberPadActionContext.Provider
      value={{
        onAppend: handleAppend,
        onDelete: handleDelete,
        onClear: handleClear,
        getValue: handleGetValue,
      }}>
      <NumberPadValueContext.Provider value={value}>
        {children}
      </NumberPadValueContext.Provider>
    </NumberPadActionContext.Provider>
  );
};

export const useNumberPadAction = () => {
  const context = useContext(NumberPadActionContext);

  if (context === undefined) {
    throw new Error(
      `${useNumberPadAction.name} should be used within ${NumberPadProvider.name}`,
    );
  }

  return context;
};
export const useNumberPadValue = () => {
  const context = useContext(NumberPadValueContext);

  if (context === undefined) {
    throw new Error(
      `${useNumberPadValue.name} should be used within ${NumberPadProvider.name}`,
    );
  }

  return context;
};
