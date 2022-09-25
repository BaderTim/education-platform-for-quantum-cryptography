import React from "react";
import { Link } from "react-router-dom";
import { ProgressBar } from "../components/ProgressBar";
import { iPageInfo } from "../interfaces/iPageInfo";
import { iPageSelectionProps } from "../interfaces/views/iPageSelectionProps";
import { iPageSelectionState } from "../interfaces/views/iPageSelectionState";
import { ErrorView } from "./ErrorView";
import { LoadingView } from "./LoadingView";


export default class PageSelectionView extends React.Component<iPageSelectionProps, iPageSelectionState> {

  constructor(props: iPageSelectionProps) {
    super(props);
    this.state = {
      errors: [],
      loading: false,
    }
  }

  render() {
    
    // Render error if there is one
    if(this.state.errors.length > 0) {
      return <ErrorView errors={this.state.errors}/>
    }

    // loading symbol if content is not loaded
    if(this.state.loading) {
      return <LoadingView>Initialisiere Seiten...</LoadingView>
    }
    
    return <div>
      <div className="d-flex flex-column w-100 align-items-center mt-4 mb-1">
        <h3 className="display-2 w-100 text-center">Kapitelauswahl</h3>
        <div className="d-block w-50 mt-3 align-items-center">
          <div className="lead mb-1 text-center">Dein aktueller Lernfortschritt</div>
          <ProgressBar  progress={this.props.progress}/>
      </div>
      </div>
      <br/>
      <div className="d-flex flex-wrap justify-content-center mb-3">
        {this.props.contentInfo.map((pageInfo: iPageInfo, index: number) => {
          let iconpath = `/pages/${pageInfo.id}/${pageInfo.id}`;
          if (this.props.progress[index].progress === 100) {
            iconpath += "-fin.png";
          } else {
            iconpath +="-uf.png";
          }
          return (<div key={index} className="my-5 mx-3" style={{ width:"300px"}} >
            <Link  style={{justifyContent:"center", display:"flex"}} to={`/chapter/${pageInfo.id}`}>
              <img  src={process.env.PUBLIC_URL + iconpath} alt="" width="150px" />
            </Link> 
            <br/>

            <div style={{justifyContent:"center", display:"flex", marginTop:"-15px"}}>
              <Link 
                style={{textDecoration: "none", fontSize:"1.1em", color:"black"}} 
                to={`/chapter/${pageInfo.id}`}
              >{pageInfo.id}. {pageInfo.title}</Link>
              <span className="ms-3 text-secondary">[{Math.round(this.props.progress[index].progress)}%]</span>
            </div>
          </div>)
        })}
      </div>
    </div>
  }
    
}