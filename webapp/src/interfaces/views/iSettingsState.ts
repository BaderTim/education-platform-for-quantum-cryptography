import { ErrorDto } from "../../ErrorDto";

export interface iSettingsState  {
    errors: ErrorDto[];
    loading: boolean;
}