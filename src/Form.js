import Field from "./Field";

// A full interactive form containing many fields.
function Form({
  values,  // dict mapping field name to value.
  setValues,
  fields,
}) {
  let renderedFields = [];
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const value = values[field.name];
    const setValue = (v) => {
      setValues({ ...values, [field.name]: v });
    };
    const id = `form-field-${field.name}`;
    renderedFields.push(
      <Field
        key={field.name}
        value={value}
        setValue={setValue}
        id={id}
        {...field}
      />
    );
  }
  return (<div>
    {renderedFields}
  </div>);
}

export default Form;