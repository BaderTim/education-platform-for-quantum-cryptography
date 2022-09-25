import React from "react";
import { PageLocation } from "../components/PageLocation";
import { iSettingsProps } from "../interfaces/views/iSettingsProps";
import { iSettingsState } from "../interfaces/views/iSettingsState";
import { ErrorView } from "./ErrorView";
import { LoadingView } from "./LoadingView";

export default class SettingsView extends React.Component<iSettingsProps, iSettingsState> {

  constructor(props: iSettingsProps) {
    super(props);
    this.state = {
      errors: [],
      loading: true
    }
  }

  componentDidMount() {
    // TODO: implement
    this.setState({loading: false});
  } // end of componentDidMount


  handleSettingChange(key: string, newValue: string) {
    this.props.handleSettings({...this.props.settings, [key]: newValue});
  }

  settingSelect = (key: string, currentValue: string, selection: string[]) => {
    return <select className="form-select" defaultValue={currentValue} onChange={(event) => this.handleSettingChange(key, event.target.value)}>
      {selection.map((value: string, index: number) => {
        return <option key={index} value={value}>{value}</option>
      })}
    </select>
  }

  settingInputField = (key: string, currentValue: string | null, hidden?: boolean, text = "Übernehmen") => {
    console.log()
    return <div className="d-flex">
      <input className="form-control me-2" type={hidden ? "password" : "text"} defaultValue={currentValue ? currentValue : ""} />
      <button type="button" className="btn btn-primary w-50" onClick={(event) => {
        const inputElement = event.currentTarget.parentElement?.firstChild as HTMLInputElement;
        this.handleSettingChange(key, inputElement.value);
        }}
        >{text}</button>
    </div>
  }


  render() {

    // Render error if there is one
    if(this.state.errors.length > 0) {
      return <ErrorView errors={this.state.errors}/>
    }

    // loading symbol if content is not loaded
    if(this.state.loading) {
      return <LoadingView>Lade gespeicherte Einstellungen...</LoadingView>
    }

    const { settings } = this.props;
    
    return <div className="mb-5 mt-3">
      <PageLocation paths={["settings"]} pathTitles={["Einstellungen"]}/>
      <h1 className="display-1">Einstellungen</h1>
      <br/>
      <table className="lead table table-hover" style={{maxWidth: "800px"}}>
        <thead>
          <tr><th scope="col">Name</th><th scope="col">Wert</th></tr>
        </thead>
        <tbody>
          <tr key={settings["Design"]}><th scope="row">Design</th><td>{settings["Design"] ? settings["Design"] : "-"}</td></tr>
          <tr key={settings["Sprache"]}><th scope="row">Sprache</th><td>{settings["Sprache"] ? settings["Sprache"] : "-"}</td></tr>
          <tr key={settings["Ansicht"]}><th scope="row">Ansicht</th><td>{this.settingSelect("Ansicht", settings["Ansicht"], ["Desktop", "Beamer"])}</td></tr>
          <tr key={settings["OpenAi Api Key"]}><th scope="row"><a href="https://beta.openai.com/account/api-keys" target="_blank" rel="noreferrer">OpenAi Api Key</a></th><td>{this.settingInputField("OpenAi Api Key", settings["OpenAi Api Key"], true, "Key speichern")}</td></tr>
        </tbody>
      </table>
    </div>
  }

}