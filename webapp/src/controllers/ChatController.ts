import { ErrorDto } from "../ErrorDto";
import { iMessage } from "../interfaces/iMessage";

export class ChatController {

    private apiKey: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey ? apiKey : "";
    }

    public loadChatHistory(): iMessage[] {
        const storedMessages = localStorage.getItem("epfqc-messages");
        if (storedMessages) {
            return JSON.parse(storedMessages);
        }
        return [];
    }

    public async sendMessage(message: iMessage, latex: string): Promise<iMessage> {
        this._saveMessage(message);
        if (this.apiKey === null || this.apiKey === "") {
            await new Promise(resolve => setTimeout(resolve, 200));
            const emptyKeyMessage: iMessage = {
                self: false,
                text: "Bitte trage zuerst einen OpenAI API-Key in den Einstellungen ein.", 
                timestamp: Number(Date.now())
            }
            this._saveMessage(emptyKeyMessage);
            return emptyKeyMessage;
        }
        const answer: string | ErrorDto = await this._openAPIaskQuestion(message.text, latex);
        if(answer instanceof ErrorDto) {
            // handle error
            const errorMessage: iMessage = {text: answer.message, timestamp: Number(Date.now())};
            this._saveMessage(errorMessage);
            return errorMessage;
        }
        const answerMessage: iMessage = {text: answer, timestamp: Number(Date.now())};
        this._saveMessage(answerMessage);
        return answerMessage;
    }

    private _saveMessage(newMessage: iMessage): void {
        const messages = this.loadChatHistory();
        messages.push(newMessage);
        localStorage.setItem("epfqc-messages", JSON.stringify(messages));
    }

    private async _openAPIaskQuestion(question: string, latex: string): Promise<string | ErrorDto> {
        console.log(latex)
        // ask question
        const body = {
            "question": question,
            "search_model": "babbage",
            "model": "curie",
            "examples": [
                ["What does the qft do?", "It transforms between a special fourier base and the classical base (Z)."], 
                ["How does a single quibt quantum fourier transform work?", "it transforms between the Z-basis states to the X-basis states."],
                ["What does a UROT gate do?", "It is a unitary rotation gate which enables the user to rotate the qubit in any direction."],
                ["What does a CNOT gate do?", "It is a controlled not gate which enables the user to execute a NOT operation on Qubit B when Qubit A is in the state |1>."],
                ["How many amplitudes does a two qubit state need?", "It needs four complex amplitudes."],
                ["How many states can be described with the Tensor Product?", "Infinite."],
                ["What is an example superposition state?", "The bell state |s> = 1/2 * (|00> + |11>). When measured it will return either |00> or |11>."],
            ],
            "examples_context": "A controlled not gate enables the user to execute a NOT operation on Qubit B when Qubit A is in the state |1>. The bell state |s> = 1/2 * (|00> + |11>). When measured it will return either |00> or |11>. The quantum Fourier transform (QFT) transforms between two bases, the computational (Z) basis, and the Fourier basis. The H-gate is the single-qubit QFT, and it transforms between the Z-basis states to the X-basis states. This summary of states using the tensor product can be applied to any number of qubits.",
            "documents": latex.split("\\newline"),
            "max_tokens": 200
        }
        const res = await this._fetchOpenAPI("https://api.openai.com/v1/answers", "POST", body);
        if (res instanceof ErrorDto) {
            return res;
        }
        return res.answers[0] as string;
    }

    private async _fetchOpenAPI(url: string, method: string, body: any, contentType: string = "application/json"): Promise<any | ErrorDto> {
        console.log(body)
        return fetch(url, {
            method: method,
            headers: { 
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': contentType
            },
            body: JSON.stringify(body)
        })
        .then(async (res) => {
            return await res.json().then(json => {
                if (res.status === 200) {
                    return json;
                }
                console.log(json)
                return new ErrorDto(String(res.status), `Request Error #${res.status}: ${json.error.message}.`);
            });
        })
    }

}