import { iSettings } from "../interfaces/iSettings";

export class SettingsController {

    public loadSettings(): iSettings {
        const storedSettings = localStorage.getItem("epfqc-settings");
        if (storedSettings) {
            return JSON.parse(this._unSaltString(storedSettings));
        }
        const baseSettings: iSettings = {
            "Sprache": "deutsch",
            "Design": "hell",
            "Ansicht": "desktop",
            "OpenAi Api Key": null
        };
        return baseSettings;
    }

    public saveSettings(settings: iSettings): void {
        localStorage.setItem("epfqc-settings", this._saltString(JSON.stringify(settings)));
    }

    private _saltString(input: string) {
        return "awdsd?=ASDA2jdaj3{asda:aasdasd}sdasd"+input.split("").reverse().join("") + "awda3d3{asdas}asdasd";
    }

    private _unSaltString(input: string) {
        return input.replace("awdsd?=ASDA2jdaj3{asda:aasdasd}sdasd", "").replace("awda3d3{asdas}asdasd", "").split("").reverse().join("");
    }
}