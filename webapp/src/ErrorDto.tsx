export class ErrorDto {
    public title: string;
    public message: string;
    public submessage?: string;

    constructor(title: string, message: string, submessage: string = "") {
        this.title = title;
        this.message = message;
        this.submessage = submessage;
    }
}