import { iMessage } from "../iMessage";
import { iPageInfo } from "../iPageInfo";
import { iPageProgress } from "../iPageProgress";
import { iSettings } from "../iSettings";

export interface iPageProps {
    match?: {
        params: {
            pageId: string;
        };
    };
    progress: iPageProgress[];
    settings: iSettings;
    contentInfo: iPageInfo[];
    chatHistory: iMessage[];
    handlePageLoad: (currentPage: string) => void;
    handleProgress: (progress: iPageProgress[]) => void;
    handleMessage: (message: iMessage) => Promise<void>;
}