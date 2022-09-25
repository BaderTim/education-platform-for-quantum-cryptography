import { ErrorDto } from "../../ErrorDto";
import { iPageInfo } from "../iPageInfo";

export interface iPageSelectionState  {
    errors: ErrorDto[];
    loading: boolean;
}