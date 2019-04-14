import * as React from "react";
import { IErrors, IFormContext, FormContext, IValues } from "./Form";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Editor = "textbox" | "multilinetextbox" | "dropdown" | "datepicker";

export interface IValidation {
  rule: (values: IValues, fieldName: string, args: any) => string;
  args?: any;
}

export interface IFieldProps {
  id: string;

  label?: string;

  editor?: Editor;

  options?: string[];

  value?: any;

  validation?: IValidation;
}

function getDate(value: any): Date{
  return value === null || value === undefined ? new Date() : new Date(value);
}

function getDateInit(value: any): string{
  return value === null || value === undefined ? moment(new Date()).format("YYYY-MM-DD") : value;
}

export const Field: React.SFC<IFieldProps> = ({
  id,
  label,
  editor,
  options,
  value
}) => {
  const getEditorStyle = (errors: IErrors): any => getError(errors) ? { borderColor: "red" } : {};
  const getError = (errors: IErrors): string => (errors ? errors[id] : "");
  
  return (
    
    <FormContext.Consumer>
      {(context: IFormContext | any) => (
        <div>
          {label && <label htmlFor={id}>{label}</label>}

          {editor!.toLowerCase() === "textbox" && (
            <input
              id={id}
              type="text"
              value={value}
              onChange={
                (e: React.FormEvent<HTMLInputElement>) =>
                  context.setValues({ [id]: e.currentTarget.value }) 
              }
              onBlur={() => context.validate(id)}
              style={getEditorStyle(context.errors)} 
              className="form-control"
            />
          )}

          {editor!.toLowerCase() === "multilinetextbox" && (
            <textarea
              id={id}
              value={value}
              onChange={
                (e: React.FormEvent<HTMLTextAreaElement>) =>
                  context.setValues({ [id]: e.currentTarget.value }) 
              }
              onBlur={() => context.validate(id)}
              style={getEditorStyle(context.errors)} 
              className="form-control"
            />
          )}

          {editor!.toLowerCase() === "dropdown" && (
            <select
              id={id}
              name={id}
              value={value}
              onChange={
                (e: React.FormEvent<HTMLSelectElement>) =>
                  context.setValues({ [id]: e.currentTarget.value }) 
              }
              onBlur={() => context.validate(id)} 
              style={getEditorStyle(context.errors)} 
              className="form-control"
            >
              {options &&
                options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          )}

          {editor!.toLowerCase() === "datepicker" && (
            <DatePicker
              id={id}
              selected={getDate(context.values[id])}
              value = {value}
              onChange={(e:Date) => context.setValues({ [id]: moment(e).format("YYYY-MM-DD") })}
              onBlur={() => context.validate(id)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
            />
          )}

          {getError(context.errors) && (
            <div style={{ color: "red", fontSize: "80%" }}>
              <p>{getError(context.errors)}</p>
            </div>
          )}
        </div>
      )}
    </FormContext.Consumer>
  );
};
Field.defaultProps = {
  editor: "textbox"
};