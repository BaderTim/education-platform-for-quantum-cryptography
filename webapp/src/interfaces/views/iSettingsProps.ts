import { iSettings } from "../iSettings";

export interface iSettingsProps  {
    settings: iSettings;
    handleSettings: (settings: iSettings) => void;
}