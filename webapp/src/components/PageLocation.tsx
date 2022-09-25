import { Breadcrumb } from "react-bootstrap"
import { iPageLocation } from "../interfaces/components/iPageLocation"


export const PageLocation: React.FunctionComponent<iPageLocation> = (props) => {

    const paths = ["/"].concat(props.paths);
    const pathTitles = ["Home"].concat(props.pathTitles);
    const pathLength = paths.length;
    const publicUrl = process.env.PUBLIC_URL.includes("http") ? `/${process.env.PUBLIC_URL.split("//")[1].split("/")[1]}` : process.env.PUBLIC_URL
    
    const getPath = (index: number): string => {
        if (index === 0) {
            return publicUrl;
        }
        let currentPath = "";
        for (let i = 1; i <= index; i++) {
            currentPath += "/"+paths[i];
        }
        return `${publicUrl}${currentPath}`;
    }

    return <Breadcrumb>
        {pathTitles.map((pathElementTitle: string, index: number) => {
            if (index+1 === pathLength) {
                return <Breadcrumb.Item key={index} href={getPath(index)} active>{pathElementTitle}</Breadcrumb.Item>
            }
            return <Breadcrumb.Item key={index}  href={getPath(index)}>{pathElementTitle}</Breadcrumb.Item>
        })}
    </Breadcrumb>


}