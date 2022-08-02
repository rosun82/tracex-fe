import Spreadsheet from "react-spreadsheet";

const emptyCell = { value: "" };

const sheetProps = {
  className: "table-striped",
};

// A grid component based on react spreadsheet
// (https://iddan.github.io/react-spreadsheet).
//
// TODO(rosun): Formula is not well supported.
function Grid({
  value,
  setValue,
  readOnly,
}) {
  if (value == null) {
    value = [];
  }

  if (readOnly) {
    return <div><Spreadsheet data={getReadOnlyCopy(value)} {...sheetProps} /></div>;
  }

  // For mutable grid, we add support for adding / removing rows / columns.
  // This respects the read only property of the cell, i.e., resize will not
  // delete any of the cell marked read only (e.g., column & row names.)
  let minRow = 0;
  let minCol = 0;
  for (let r = 0; r < value.length; r++) {
    for (let c = 0; c < value[r].length; c++) {
      if (value[r][c] != null && value[r][c].readOnly) {
        minRow = r > minRow ? r : minRow;
        minCol = c > minCol ? c : minCol;
      }
    }
  }

  const addRow = () => {
    if (value.length === 0) {
      setValue([[emptyCell]]);
      return;
    }
    let newValue = [...value];
    newValue.push(Array(value[0].length).fill(emptyCell));
    setValue(newValue);
  };

  const removeRow = () => {
    if (value.length <= minRow) {  // do not remove read only.
      return
    }
    setValue(value.slice(0, -1));
  };

  const addCol = () => {
    if (value.length === 0) {
      setValue([[emptyCell]]);
      return;
    }
    let newValue = [...value];
    for (let r = 0; r < newValue.length; r++) {
      newValue[r] = [...newValue[r], emptyCell];
    }
    setValue(newValue);
  };

  const removeCol = () => {
    if (value.length === 0 || value[0].length <= minCol) {
      return;
    }
    let newValue = [...value];
    for (let r = 0; r < newValue.length; r++) {
      newValue[r] = newValue[r].slice(0, -1);
    }
    setValue(newValue);
  };

  const valueJson = JSON.stringify(value);

  const handleChange = (v) => {
    // We must make sure the value has actually changed, otherwise there is
    // some infinite loop.
    if (JSON.stringify(v) !== valueJson) {
      setValue(v);
    }
  };

  return (
    <div>
      <Spreadsheet data={value} onChange={handleChange} {...sheetProps} />
      <br></br>
      <button className="btn" onClick={addRow}>Add Row</button>
      <button className="btn" onClick={removeRow}>Remove Row</button>
      <button className="btn" onClick={addCol}>Add Column</button>
      <button className="btn" onClick={removeCol}>Remove Column</button>
    </div>
  );
}

export function createEmpty(row, col) {
  let result = Array(row);
  for (let i = 0; i < result.length; i++) {
    result[i] = Array(col).fill(emptyCell);
  }
  return result
}

// Adding read only property to each cell, which requires a copy as values is
// not mutable.
const getReadOnlyCopy = (value) => {
  let copied = [...value];
  for (let r = 0; r < copied.length; r++) {
    copied[r] = [...copied[r]];
    for (let c = 0; c < copied[r].length; c++) {
      copied[r][c] = { ...copied[r][c] };
      copied[r][c].readOnly = true;
    }
  }
  return copied;
};

export default Grid;
