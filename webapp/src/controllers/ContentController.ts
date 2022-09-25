import { ErrorDto } from "../ErrorDto"
import { iJSONpage } from "../interfaces/controllers/iJSONpage";
import { iPageInfo } from "../interfaces/iPageInfo"

export class ContentController {

    publicUrl: string = process.env.PUBLIC_URL.includes("http") ? `/${process.env.PUBLIC_URL.split("//")[1].split("/")[1]}` : process.env.PUBLIC_URL;
    pathToPages: string;

    constructor(pathToPages ="/pages", publicUrlPrefix=true) {
        this.pathToPages = publicUrlPrefix ? `${this.publicUrl}${pathToPages}` : pathToPages;
    }

    public async getContentInfo(): Promise<iPageInfo[] | ErrorDto> {
        // return new ErrorDto("Not implemented", "This method is not implemented yet.", "Please contact the administrator.")
        const pages: iPageInfo[] = [];
        let pageId: number = 1;
        while(true) {
            const currentPage = await this._fetchJSONpage(pageId);
            if (currentPage instanceof ErrorDto) {
                return pages;
            }
            // TODO: error handling
            const newPage: iPageInfo = {
                id: currentPage.id,
                title: currentPage.title
            };
            pages.push(newPage);
            pageId++;
        }
    }

    private async _fetchJSONpage(id: number): Promise<iJSONpage | ErrorDto> {
        return fetch(`${this.pathToPages}/${id}/page.json`, {
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            }
            return new ErrorDto("Page not found", `The page you requested does not exist. (Page ${id})`, "Make sure the JSON file exists.")
        }).catch(err => {
            return new ErrorDto("Page not found", `The page you requested does not exist. (Page ${id})`, "Make sure the JSON file exists.")
        });
    }

    private async _fetchLatexPage (id: number): Promise<Response> {
        return fetch(`${this.pathToPages}/${id}/latex_page.tex`, {
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'text/plain'
           }});
        };

    public async getLatexPage (id: number): Promise<string | ErrorDto> {
        return this._fetchLatexPage(id).then((res: any) => {
            if (res.status === 200) {
                return res.text();
            }
            return new ErrorDto("Page not found", `The page you requested does not exist. (Page ${id})`, "Make sure the .tex file exists.");
        }).catch(err => {
            return new ErrorDto("Page not found", `The page you requested does not exist. (Page ${id})`, "Make sure the .tex file exists.")
        });
    }

}