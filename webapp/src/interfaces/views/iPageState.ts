import { ErrorDto } from "../../ErrorDto";

export interface iPageState {
    latexPage: JSX.Element | null;
    errors: ErrorDto[];
    fetchLoading: boolean;
    renderLoading: boolean;
}