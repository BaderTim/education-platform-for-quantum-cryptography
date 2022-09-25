import React, {useEffect, useRef} from "react";
import { iMessage } from "../interfaces/iMessage";
import { iChatProps } from "../interfaces/views/iChatProps";
import { iChatState } from "../interfaces/views/iChatState";

export class ChatView extends React.Component<iChatProps, iChatState> {

  constructor(props: iChatProps) {
    super(props);
    this.state = {
      open: false
    }
  }

  render() {
    const { open } = this.state;
    const handleClose = (): void => {
      this.setState({ open: false });
    }
    return <div className="position-fixed bottom-0 end-0 me-5 mb-5">
      {open ? (<ChatWindow messages={this.props.chatHistory} handleClose={handleClose} handleMessage={this.props.handleMessage}/>) : (this.helpButton())}
    </div>
  }


  //
  // Help button
  //


  helpButton = (): JSX.Element => {
    const handleClick = () => {
      this.setState({open: true});
    };
    return <div 
      onClick={handleClick} 
      className="shadow p-2 px-3 rounded zindex-modal" 
      style={{cursor: "pointer", backgroundColor: "#a2d3de"}}
      ><span className="me-2">Brauchst du Hilfe?</span>{this.iconHelp(50, 50)}
    </div>;
  }


  //
  // Icons
  //

  iconHelp = (width = 30, height = 30) => {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-question-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
      </svg>)
  }
}




export const ChatWindow: React.FunctionComponent<{messages: iMessage[], handleClose: () => void, handleMessage: (message: iMessage) => Promise<void>}> = (props) => {
  const iconClose = (width = 30, height = 30) => {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
      <path fillRule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
      </svg>)
  }
  const chatMessage = (index: number, message: iMessage): JSX.Element => {
    const { text, timestamp, self } = message;
    const date = new Date(timestamp);
    const dd = (par: number | string) => ("0" + par).slice(-2); // doube digit
    const dateString = `${dd(date.getDay())}.${dd(date.getMonth())}.${date.getFullYear()} ${dd(date.getHours())}:${dd(date.getMinutes())}`;
    return <div key={index} className={`w-100 d-flex ${self && "justify-content-end"}`}>
      <span className={`px-2 p1-2 my-2 ${self ? "rounded-start bg-info" : "rounded-end bg-light"}`} style={{maxWidth: "80%"}}>
        <p className="text-secondary w-100 m-0" style={{fontSize: "13px"}}><b>{self ? "You" : "GPT-3"}</b> - {dateString}</p>
        <p className="m-0">{text}</p>
      </span>
    </div>;
  }

  const { messages, handleClose, handleMessage } = props;
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages]);
  
  const containerStyle: React.CSSProperties = {
    width: "300px",
    height: "400px",
    borderRadius: "30px!important",
  }

  return <div style={containerStyle} className="shadow-lg border p-2 px-3 bg-body rounded d-flex flex-column justify-content-between">

    <div>
      <div className="d-flex justify-content-between">
        <span>Chatte mit der GPT-3 KI</span>
        <span onClick={handleClose} style={{cursor: "pointer"}}>{iconClose(20, 20)}</span>
      </div>
      <hr className="my-2"/>
    </div>

    <div className="h-100" style={{overflow: "auto"}}>
      {messages.length === 0 && <p className="position-absolute top-50 start-50 translate-middle w-75 text-center">Dieser Chatverlauf ist leer.</p>}
      {messages.map((message, index) => {
        return chatMessage(index, message)
      })}
      <div ref={messagesEndRef} />
    </div>

    <div>
    {<InputField handleMessage={handleMessage}/>}
    </div>

  </div>;
}




export const InputField = (props: {handleMessage: (message: iMessage) => Promise<void>}) => {
  const iconSend = (width = 30, height = 30) => {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} style={{transform: "rotate(45deg)"}} fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
      <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
      </svg>)
  }
  const inputRef = useRef<null | HTMLInputElement>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault();
    const input = inputRef.current;
    if (input) {
      const text = input.value;
      input.value = "";
      input.disabled = true;
      input.placeholder = "Warte auf Antwort...";
      await props.handleMessage({text, timestamp: Date.now(), self: true});
      input.disabled = false;
      input.placeholder = "Nachricht";
    }
  }

  return <form className="d-flex mt-2" onSubmit={(event) => handleSubmit(event)}>
    <input ref={inputRef} type="text" className="form-control" style={{width: "84%"}} placeholder="Nachricht"/>
    <span 
      className="d-flex justify-content-center align-self-center me-2" 
      style={{width: "16%"}}>
      <span onClick={(event) => handleSubmit(event)} style={{cursor: "pointer"}}>
        {iconSend(27, 27)}
      </span>
    </span>
  </form>;
}
