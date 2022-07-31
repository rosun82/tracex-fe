import { Fragment, useState, useEffect } from "react";

import './App.css';
import Form from "./Form";
import { typeCharMap } from "./Field";
import { createEmpty } from "./Grid";

const fakeJson = {
  form: [
    {
      label: "History income statement",
      name: "histIncomeStatement",
      type: "table",
      value: createEmpty(8, 12),
    },
    {
      label: "Method for computing projected income",
      name: "projIncomeMethod",
      type: "enum",
      enum_options: [
        "",
        "Compute based on CAGR",
        "Provide manually",
      ],
      attnMsg: "Field is Missing!",
    },
    {
      label: "Company name",
      name: "companyName",
      type: "string",
      attnMsg: "Field is Missing!",
    },
    {
      label: "Company age",
      name: "companyAge",
      type: "number",
      value: 3,
    },
  ],
};

const fetchData = (jsonReq, cb) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonReq,
  };
  fetch('https://reqres.in/api/posts', requestOptions)
    .then(resp => resp.json())
    .then(_ => fakeJson)
    .then(cb);
};

function NavItem({ field }) {
  return (
    <a
      href={`#form-field-${field.name}`}
      className="text-decoration-none btn text-start">
      <span className="bg-info text-white rounded" style={
        {
          fontFamily: "monospace",
          fontWeight: 900,
          paddingLeft: "3px",
          paddingRight: "3px",
        }
      }>{typeCharMap[field.type]}</span> {field.label}
    </a>
  );
}

function App() {
  const [state, setState] = useState({ form: [] });

  const setStateWithLog = (v) => {
    console.log(v);
    setState(v);
  }

  // Set initial state after loading by sending an empty response. Server side
  // will then send everything.
  useEffect(() => {
    fetchData(JSON.stringify({}), setStateWithLog);
  }, []);

  let values = {};
  if (state.form) {
    for (let i = 0; i < state.form.length; i++) {
      const field = state.form[i];
      values[field.name] = field.value;
    }
  }

  const setValues = (v) => {
    let newForm = [...state.form];
    for (let i = 0; i < newForm.length; i++) {
      if (newForm[i].name in v) {
        newForm[i] = { ...newForm[i], value: v[newForm[i].name] };
      }
    }
    setStateWithLog({ ...state, form: newForm });
  };

  const handleSubmit = (e) => {
    fetchData(JSON.stringify(values), setStateWithLog);
  };

  // We take the state and generate a catalog and a main page.
  let navs = [];
  if (state.form) {
    for (let i = 0; i < state.form.length; i++) {
      const field = state.form[i];
      navs.push(<NavItem key={field.name} field={field} />);
    }
  }

  return (
    <Fragment>
      <div className="container-fluid p-2 bg-primary text-white text-left">
        <h1>Trace X: The Right Way of Doing Financial Computing</h1>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            {navs}
          </div>
          <div className="col-lg-10">
            <Form values={values} setValues={setValues} fields={state.form} />
            <div className="btn btn-primary" onClick={handleSubmit}>Submit</div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
