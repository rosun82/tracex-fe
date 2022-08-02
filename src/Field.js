import Grid from "./Grid";

export const typeCharMap = {
  "string": "S",
  "number": "N",
  "enum": "E",
  "table": "T",
};

// A form field, which can be
//
// - Number
//
// - String
//
// - Enum (implemented as selection)
//
// - Table
//
// For grid, value is the JSON data of the form. Error is the error with the
// current value passed from serve side.
function Field({
  value,
  setValue,
  id,  // field id for quick navigation within page.
  name,  // unique name of the field used in form response, camel case.
  type,  // string|number|enum|table
  enum_options,  // for enum type only.
  label,  // display label.
  attnMsg,  // if the field needs attention, the message.
}) {
  const wrapProps = {
    id: id,
    label: label,
    attnMsg: attnMsg,
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  if (type === "string") {
    return (
      <WrapField {...wrapProps}>
        <input type="text" name={name} value={value} onChange={handleChange} />
      </WrapField>
    );
  } else if (type === "number") {
    return (
      <WrapField {...wrapProps}>
        <input type="number" name={name} value={value} onChange={handleChange} />
      </WrapField>
    );
  } else if (type === "enum") {
    return (
      <WrapField {...wrapProps}>
        <select value={value} onChange={handleChange} >
          {
            enum_options.map(function (opt, i) {
              return <option value={opt} key={opt}>{opt}</option>;
            })
          }
        </select>
      </WrapField>
    );
  } else if (type === "table") {
    return (
      <WrapField {...wrapProps}>
        <Grid value={value} setValue={setValue} readOnly={false}></Grid>
      </WrapField>
    );
  } else {
    const props = { ...wrapProps, attnMsg: `Invalid field type ${type}` };
    return <WrapField {...props} />;
  }
}

function WrapField({ id, label, attnMsg, children }) {
  // If there is an attention message, we unfold the field, otherwise fold by
  // default.
  // const open = !!attnMsg;
  let headerClasses = ["card-header"];
  if (!!attnMsg) {
    headerClasses.push(["bg-warning"]);
  } else {
    headerClasses.push(["bg-success"]);
  }
  headerClasses.push(["text-white"]);
  return (
    <div id={id} className="card mb-3" style={{ width: "fit-content" }}>
      <h6 className={headerClasses.join(" ")}>
        {label}
        {attnMsg &&
          <span
            className="text-danger"
            style={{ fontSize: "90%", fontStyle: "italic" }}>
            &nbsp;&nbsp;{attnMsg}
          </span>
        }
      </h6>

      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

export default Field;
