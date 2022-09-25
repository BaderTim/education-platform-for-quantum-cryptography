import { Alert } from "react-bootstrap";
import { ErrorDto } from "../ErrorDto";

export const ErrorView: React.FunctionComponent<{errors: ErrorDto[]}> = (props) => {

    const errors: ErrorDto[] = props.errors;

    return <>
        {Array.from(errors).map((error: ErrorDto, id: number) => {
            return <Alert 
                key={id} 
                variant="danger" 
                dismissible={false}
                style={{margin: "2em 0em 2em 0em"}}
                >
                    <span>Error #{id+1}:</span>
                    <Alert.Heading>{error.title}</Alert.Heading>
                    <p>
                        {error.message}
                        {error.submessage ? <><br/>{error.submessage}</> : null}
                    </p>
            </Alert>
        })}
    </>

}
