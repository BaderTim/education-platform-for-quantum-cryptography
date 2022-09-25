import { iPageInfo } from "../interfaces/iPageInfo";
import { iPageProgress } from "../interfaces/iPageProgress";

export class ProgressController {

    loadProgress(contentInfo: iPageInfo[]): iPageProgress[] {
        const rawStoredProgress = localStorage.getItem("epfqc-progress");
        // check if progress exists in localStorage
        if (rawStoredProgress) {
            const storedProgress = JSON.parse(rawStoredProgress);
            // check if progress is in sync with the pages
            contentInfo.forEach(page => {
                // try to find the page in the stored progress array by title
                const progress = storedProgress.find((prog: iPageProgress) => prog.title === page.title);
                // if found, check if ids also match
                if (progress) {
                    if(page.id !== progress.id) {
                        // if not, set new id
                        progress.id = page.id;
                        // this is in case a new page has been inserted in the middle 
                        // the title stays the same, but the id changes
                    }
                // if not found, add new progress entry
                } else {
                    storedProgress.push({
                        id: page.id,
                        title: page.title,
                        progress: 0,
                        exercises: []
                    });
                }
            });
            return storedProgress;
        }
        // if no progress is found, return a base progress array
        const baseProgress: iPageProgress[] = [];
        // add empty progress object for each page
        contentInfo.forEach(page => {
            baseProgress.push({
                pageID: page.id,
                title: page.title,
                progress: 0,
                exercises: []
            });
        });
        return baseProgress;
    }
    
    saveProgress(progress: iPageProgress[]): void {
        localStorage.setItem("epfqc-progress", JSON.stringify(progress));
    }

}