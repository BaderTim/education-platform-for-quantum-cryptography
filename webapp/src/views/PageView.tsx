import React from "react";
import { withRouter } from "../App";
import { ProgressBar } from "../components/ProgressBar";
import { ContentController } from "../controllers/ContentController";
import { ErrorDto } from "../ErrorDto";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { iPageProps } from "../interfaces/views/iPageProps";
import { iPageState } from "../interfaces/views/iPageState";
import { ErrorView } from "./ErrorView";
import { LoadingView } from "./LoadingView";
import { ParserController } from "../controllers/ParserController";
import { PageLocation } from "../components/PageLocation";
import { PageNavigation } from "../components/PageNavigation";
import { ChatView } from "./ChatView"; 
import { iPageProgress } from "../interfaces/iPageProgress";


class PageView extends React.Component<iPageProps, iPageState>  { // props, state interfaces

  constructor(props: iPageProps) {
    super(props);
    this.state = {
      latexPage: null,
      errors: [],
      fetchLoading: true, // fetching data
      renderLoading: true // rendering data
    }
  }

  componentDidUpdate(prevProps: iPageProps, prevState: iPageState) {
    // if the page has changed, simulate a page load
    if(prevProps.match?.params.pageId !== this.props.match?.params.pageId) {
      this.componentWillUnmount();
      this.setState({
        latexPage: null,
        errors: [],
        fetchLoading: true,
        renderLoading: true 
      });
      this.componentDidMount();
    }
  }

  onFinishLoading = () => {
    this.setState({renderLoading: false});
  }

  updateProgress = (newProgress: iPageProgress) => {
    const progress = this.props.progress;
    progress[Number(this.props.match?.params?.pageId)-1] = newProgress;
    this.props.handleProgress(progress);
  }

  componentDidMount() {
    if(this.props.match == null || this.props.match.params.pageId == null || isNaN(Number(this.props.match.params.pageId))) {
      const new_error = new ErrorDto("Missing or invalid page number", "The page number is missing or invalid. Please check the URL and try again.");
      this.setState({errors: [...this.state.errors, new_error]});
      return;
    }
    // get page id
    const pageID = Number(this.props.match.params.pageId);
    // evaluate jsonPage after loading and set state
    new ContentController().getLatexPage(pageID).then((rawLatexPage: string | ErrorDto) => {
      // check if latexPage is an error object
      if(rawLatexPage instanceof ErrorDto) {
        this.setState({
          // Push error to errors array
          errors: [...this.state.errors, rawLatexPage],
          fetchLoading: false
        });
        return;
      }
      // parse latexPage if no error
      new ParserController(pageID, this.onFinishLoading).convertLatexToJSX(rawLatexPage).then((latexPage: JSX.Element | ErrorDto) => {
        if(latexPage instanceof ErrorDto) {
          this.setState({
            // Push error to errors array
            errors: [...this.state.errors, latexPage],
            fetchLoading: false
          });
          return;
        }
        this.setState({
          latexPage: latexPage,
          fetchLoading: false
        });
        // pass raw latex page to app component
        this.props.handlePageLoad(rawLatexPage);
        // update progress
        const currentProgress = this.props.progress[pageID-1];
        currentProgress.progress = 100;
        this.updateProgress(currentProgress);
        // scroll to the top, needed because of next buttons
        window.setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 200);
      }); // end of new ParserController().convertLatexToJSX()
    }); // end of new ContentController().getLatexPage()
  }

  
  componentWillUnmount() {
    // remove manual script tags on unmount
    const manualScripts = document.getElementsByClassName("manualScript");
    for(let i = 0; i < manualScripts.length; i++) {
      manualScripts[i].remove();
    }
  } // end of componentWillUnmount()


  render() {

    const { errors, fetchLoading, renderLoading, latexPage } = this.state;

    // Render error if there is one
    if(errors.length > 0) {
      return <ErrorView errors={errors}/>
    }

    // loading symbol if content is not loaded
    if(fetchLoading) {
      return <LoadingView>Lade Seitendaten...</LoadingView>
    }

    const pageID = Number(this.props.match?.params.pageId);
    const { contentInfo, chatHistory, settings, handleMessage} = this.props;

    return <div className="mb-5 mt-3">

      <div className="d-flex justify-content-between">
        <PageLocation paths={["chapter", String(pageID)]} pathTitles={["Kapitel", `${pageID}. ${contentInfo[pageID-1].title}`]}/>
        <PageNavigation currentPage={pageID} contentInfo={contentInfo}/>
      </div>

      <div id={"pageScriptContainer"}/>

      {renderLoading && <LoadingView>Rendere Mathe Elemente...</LoadingView>}

      <div style={{display: (renderLoading ? "none" : "unset")}}>
        
        <MathJaxContext>
          <MathJax style={{display: "none"}}>{"\\(\\Ket{1} this is needed for initializing 'Ket' notation\\)"}</MathJax>
          {latexPage ? (latexPage) : ("")}
        </MathJaxContext>

        <hr/>

        <div className="w-75 mb-4 mt-3">
          <div className="lead mb-1">Dein aktueller Lernfortschritt:</div>
          <ProgressBar progress={this.props.progress}/>
        </div>

        <PageNavigation currentPage={pageID} contentInfo={contentInfo}/>

        <ChatView settings={settings} chatHistory={chatHistory} handleMessage={handleMessage}/>

      </div>

    </div>
  } // end of render()

  
} // end of class PageView

export default withRouter(PageView);
