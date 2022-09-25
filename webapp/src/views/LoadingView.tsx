import { Spinner } from "react-bootstrap";
import { IChildrenProps } from "../interfaces/templates/iChildrenProps";

export const LoadingView: React.FunctionComponent<IChildrenProps> = (props) => {

    return <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Lade...</span>
        </Spinner>
        <br/>
        <p className="lead">{props.children ? props.children : "Loading..."}</p>
    </div>

}