import React from "react";

import { iProgressBarProps } from "../interfaces/components/iProgressBarProps";

export const ProgressBar: React.FunctionComponent<iProgressBarProps> = (props) => {

    let progress = 0;

    props.progress.forEach(element => {
        progress += element.progress;
    });

    progress = Math.round(progress / props.progress.length);

    return <div
        style={{
        width: "100%",
        height: "1.5rem",
        border: "2px solid black",
        borderRadius: "25px",
        background: `linear-gradient(90deg, rgba(40, 48, 68, 1) ${progress}%, rgba(255,255,255,1) ${progress+10}%)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: progress > 52 ? "white" : "black",
        fontWeight: "bold"
        }}
    >{progress}%</div>

}

