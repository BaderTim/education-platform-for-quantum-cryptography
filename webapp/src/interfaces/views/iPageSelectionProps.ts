import { iPageInfo } from "../iPageInfo";
import { iPageProgress } from "../iPageProgress";
import { iSettings } from "../iSettings";

export interface iPageSelectionProps  {
    progress: iPageProgress[];
    settings: iSettings;
    contentInfo: iPageInfo[];
}