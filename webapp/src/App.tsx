import React from 'react';
import { iAppState } from './interfaces/iAppState';
import { ErrorView } from './views/ErrorView';
import { LoadingView } from './views/LoadingView';
import { Route, Routes } from 'react-router';
import { Link, useParams } from 'react-router-dom';
import PageView from './views/PageView';
import PageSelectionView from './views/PageSelectionView';
import { iPageProgress } from './interfaces/iPageProgress';
import SettingsView from './views/SettingsView';
import { iSettings } from './interfaces/iSettings';
import { SettingsController } from './controllers/SettingsController';
import { iPageInfo } from './interfaces/iPageInfo';
import { ContentController } from './controllers/ContentController';
import { ErrorDto } from './ErrorDto';
import { ProgressController } from './controllers/ProgressController';
import { NavBar } from './components/NavBar';
import { PageLocation } from './components/PageLocation';
import InfoView from './views/InfoView';
import { iMessage } from './interfaces/iMessage';
import { ChatController } from './controllers/ChatController';


export default class App extends React.Component<{}, iAppState>  { // props, state interfaces

  state: iAppState = {
    contentInfo: [], 
    currentPage: "",
    progress: [],
    settings: null,
    chatHistory: [],
    errors: [],
    loading: true,
  } 

  componentDidMount() {
    // init content controller and load content, 
    // evaluate contentinfo after loading and set state
    new ContentController().getContentInfo().then((contentInfo: iPageInfo[] | ErrorDto) => {
      // check if pageInfo is an error object
      if(contentInfo instanceof ErrorDto) {
        this.setState({
          // Push error to errors array
          errors: [...this.state.errors, contentInfo],
          loading: false
        });
        return;
      }
      // load progress by using contentInfo
      const progress: iPageProgress[] = new ProgressController().loadProgress(contentInfo);
      // load settings from storage
      const settings: iSettings = new SettingsController().loadSettings();
      // load chat history from storage
      const chatHistory: iMessage[] = new ChatController().loadChatHistory();
      // set state
      this.setState({
        contentInfo: contentInfo,
        progress: progress, 
        settings: settings, 
        chatHistory: chatHistory,
        loading: false
      });
    });
  }

  handlePageLoad = (currentPage: string) => {
    this.setState({currentPage: currentPage});
  }

  handleProgress = (progress: iPageProgress[]) => {
    this.setState({progress: progress});
    new ProgressController().saveProgress(progress);
  }

  handleSettings = (settings: iSettings) => {
    this.setState({settings: settings});
    new SettingsController().saveSettings(settings);
  }

  handleMessage = async (message: iMessage): Promise<void> => {
    this.setState({chatHistory: [...this.state.chatHistory, message]});
    const res = await new ChatController(this.state.settings?.['OpenAi Api Key'] as string).sendMessage(message, this.state.currentPage);
    this.setState({chatHistory: [...this.state.chatHistory, res]});
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

    // render app
    return (
      <div>
        <NavBar contentInfo={this.state.contentInfo}/>

        <div className='container-md' style={{maxWidth: "1100px"}}>
          <Routes>
            <Route path="/" 
              element={<PageSelectionView 
                contentInfo={this.state.contentInfo}
                progress={this.state.progress} 
                settings={this.state.settings as iSettings}
              />}
            />
            <Route path="/chapter">
              <Route path="" element={<div className="mb-5 mt-3">
                <PageLocation paths={["chapter"]} pathTitles={["Kapitel"]}/>
                <h3 className="display-3">Kapitelauswahl</h3>
                <br/>
                {this.state.contentInfo.map((pageInfo: iPageInfo, index: number) => {
                  return <p key={index}>
                    <Link style={{textDecoration: "none"}} to={`/chapter/${pageInfo.id}`}>Page #{pageInfo.id}: {pageInfo.title}</Link>
                    <span className="ms-3 text-secondary">[{Math.round(this.state.progress[index].progress)}%]</span>
                  </p>
                })}
                </div>}
              />
              <Route path=":pageId" 
                element={<PageView 
                  handleProgress={this.handleProgress} 
                  handleMessage={this.handleMessage}
                  handlePageLoad={this.handlePageLoad}
                  chatHistory={this.state.chatHistory}
                  progress={this.state.progress}
                  settings={this.state.settings}
                  contentInfo={this.state.contentInfo}
                />}  
              />
            </Route>
            <Route path="/settings"
              element={<SettingsView 
                handleSettings={this.handleSettings}
                settings={this.state.settings as iSettings}
              />}
            />
            <Route path="/info" element={<InfoView/>}/>
          </Routes>
        </div>
      </div>
    );
  } // end of render


} // end of class App


// important 
// required for using path params in react-router
export function withRouter(Children: typeof React.Component) {
  return(props: any)=>{
     const match = {params: useParams()};
     return <Children {...props} match={match}/>
 }
} // end of withRouter
