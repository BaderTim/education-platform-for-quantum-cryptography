import { ErrorDto } from "../ErrorDto";
import { iMessage } from "./iMessage";
import { iPageInfo } from "./iPageInfo";
import { iPageProgress } from "./iPageProgress";
import { iSettings } from "./iSettings";

export interface iAppState  {
    contentInfo: iPageInfo[];
    currentPage: string;
    progress: iPageProgress[];
    settings: iSettings | null;
    chatHistory: iMessage[];
    errors: ErrorDto[];
    loading: boolean;
}
