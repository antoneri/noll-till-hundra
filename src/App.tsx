import { Container } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td } from "@chakra-ui/react";
import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react";
import { useState } from "react";
import "./App.css";

type Row = {
  guess: number | undefined;
  answer: number | undefined;
};

const createRow = (): Row => ({
  guess: undefined,
  answer: undefined,
});

function rowScore(row: Row) {
  if (row.guess === undefined || row.answer === undefined) {
    return 0;
  }

  const diff = Math.abs(row.guess - row.answer);

  return diff === 0 ? -10 : diff;
}

function getInitialState() {
  const rows = [];
  for (let i = 0; i < 21; i++) {
    rows.push(createRow());
  }
  return rows;
}

function totalScore(rows: Row[]) {
  return rows.reduce((tot, row) => tot + rowScore(row), 0);
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 100);
}

function Round({
  rows,
  setRows,
  from,
  to,
}: {
  rows: Row[];
  setRows: (rows: Row[]) => void;
  from: number;
  to: number;
}) {
  const setValue = (prop: keyof Row, index: number) => (value: string) => {
    const newRows = [...rows];
    newRows[index][prop] = clamp(+value);
    setRows(newRows);
  };

  const round = rows.slice(from, to);
  const score = totalScore(round);

  return (
    <>
      {round.map((row, i) => {
        i += from;
        const score = rowScore(row);

        return (
          <Tr key={i}>
            <Td>{i + 1}</Td>
            <Td isNumeric>
              <Editable
                placeholder="Ditt svar"
                aria-valuemin={0}
                aria-valuemax={100}
                value={row.guess?.toString()}
                onChange={setValue("guess", i)}
              >
                <EditablePreview />
                <EditableInput
                  type="number"
                  pattern="\d+"
                  inputMode="numeric"
                />
              </Editable>
            </Td>
            <Td isNumeric>
              <Editable
                placeholder="Rätt svar"
                aria-valuemin={0}
                aria-valuemax={100}
                isDisabled={row.guess === undefined}
                value={row.answer?.toString()}
                onChange={setValue("answer", i)}
              >
                <EditablePreview />
                <EditableInput
                  type="number"
                  pattern="\d+"
                  inputMode="numeric"
                />
              </Editable>
            </Td>
            <Td isNumeric color={score === -10 ? "green.500" : "red.500"}>
              {score !== 0 && score}
            </Td>
          </Tr>
        );
      })}
      <Tr>
        <Td isNumeric colSpan={3}>
          Delsumma
        </Td>
        <Td isNumeric color={score <= 0 ? "green.500" : "red.500"}>
          {score}
        </Td>
      </Tr>
    </>
  );
}

function App() {
  const [rows, setRows] = useState<Row[]>(getInitialState());

  return (
    <Container>
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th isNumeric colSpan={2}>
              Ditt svar
            </Th>
            <Th isNumeric>Rätt svar</Th>
            <Th isNumeric>Poäng</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Round rows={rows} setRows={setRows} from={0} to={7} />
          <Round rows={rows} setRows={setRows} from={7} to={14} />
          <Round rows={rows} setRows={setRows} from={14} to={21} />
        </Tbody>
        <Tfoot>
          <Tr>
            <Th isNumeric colSpan={3}>
              Totalsumma
            </Th>
            <Th isNumeric>{totalScore(rows)}</Th>
          </Tr>
        </Tfoot>
      </Table>
    </Container>
  );
}

export default App;
