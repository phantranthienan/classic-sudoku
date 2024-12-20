import styled from 'styled-components';
import { useAtom } from 'jotai';

import {
  selectedCellState,
  boardState,
  limitedHistoryState,
  solutionState,
  errorsState,
} from '../../jotai/atoms';

import { NUMBERS } from '../../utils/constants';

import { FaDeleteLeft } from 'react-icons/fa6';

const Numpad = () => {
  const [selectedCell, setSelectedCell] = useAtom(selectedCellState);
  const [board, setBoard] = useAtom(boardState);
  const [history, setHistory] = useAtom(limitedHistoryState);
  const [solution] = useAtom(solutionState);
  const [, setErrors] = useAtom(errorsState);

  const handleNumberClick = (number) => {
    const { row, col } = selectedCell;

    if (row === null || col === null || board[row][col].fixed) return;

    const isIncorrect = number !== solution[row][col];

    const updatedBoard = board.map((r, rIdx) =>
      r.map((cell, cIdx) =>
        rIdx === row && cIdx === col ? { ...cell, value: number } : cell
      )
    );

    setBoard(updatedBoard);
    if (isIncorrect) {
      setErrors((prevErrors) => prevErrors + 1);
    }
    if (JSON.stringify(updatedBoard) !== JSON.stringify(board)) {
      setHistory([...history, board]);
    }
    setSelectedCell({ row, col, value: number });
  };

  const handleEraseClick = () => {
    const { row, col } = selectedCell;
    if (row !== null && col !== null) {
      const updatedBoard = board.map((r, rIdx) =>
        r.map((cell, cIdx) =>
          rIdx === row && cIdx === col ? { ...cell, value: null } : cell
        )
      );

      setBoard(updatedBoard);
      if (JSON.stringify(updatedBoard) !== JSON.stringify(board)) {
        setHistory([...history, board]);
      }
      setSelectedCell({ row, col, value: null });
    }
  };

  return (
    <NumpadContainer>
      {NUMBERS.map((number) => (
        <NumpadButton key={number} onClick={() => handleNumberClick(number)}>
          {number}
        </NumpadButton>
      ))}
      <NumpadButton onClick={handleEraseClick}>
        <FaDeleteLeft />
      </NumpadButton>
    </NumpadContainer>
  );
};

const NumpadContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
  place-items: center;
  row-gap: 0.75rem;
  column-gap: 0.75rem;
  margin-top: auto;
`;

const NumpadButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  height: calc(1.75 * var(--cell-size));
  width: calc(1.25 * var(--cell-size));
  border-radius: 0.5rem;

  color: var(--editable-color);
  font-size: var(--number-size);

  background-color: var(--cell-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    filter: brightness(0.9);
  }
`;

export default Numpad;
