export interface iPageProgress {
    pageID: number;
    title: string;
    progress: number; // 0 - 100
    exercises: number[]; // exercise IDs that are completed
}