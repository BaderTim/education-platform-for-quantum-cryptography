import { iMessage } from "../iMessage";
import { iSettings } from "../iSettings";

export interface iChatProps {
    settings: iSettings;
    chatHistory: iMessage[];
    handleMessage: (message: iMessage) => Promise<void>;
}