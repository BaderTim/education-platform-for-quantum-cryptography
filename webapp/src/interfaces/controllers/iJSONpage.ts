export interface iJSONpage {
    id: number;
    title: string;
    pages: iJSONpageContent[];
}

export interface iJSONpageContent {
    content: string;
    type: string;
    subContent?: iJSONpageContent[];
    description?: string;
}