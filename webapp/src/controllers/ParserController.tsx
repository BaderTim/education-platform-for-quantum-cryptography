import { MathJax } from "better-react-mathjax";
import { ErrorDto } from "../ErrorDto";

export class ParserController {

  specialComponents: any;
  pageID: number;
  publicURL: string = process.env.PUBLIC_URL.includes("http") ? `/${process.env.PUBLIC_URL.split("//")[1].split("/")[1]}` : process.env.PUBLIC_URL;

  onFinishLoading: () => void;
  totalMathjax: number = 0;
  loadedMathJax: number = 0;

  constructor(pageID: number, onFinishLoading: () => void) {
    this.pageID = pageID;
    this.onFinishLoading = onFinishLoading;

    this.specialComponents = {
      "\\subsubsection": {
        "jsx": this._subSubSectionToJSX,
        "props": ["align"], // left - middle - right
        "startChars": "{",
        "endChars": "}"
      },
      "\\subsection": {
        "jsx": this._subSectionToJSX,
        "props": ["align"], // left - middle - right
        "startChars": "{",
        "endChars": "}"
      },
      "\\section": {
        "jsx": this._sectionToJSX,
        "props": ["align"], // left - middle - right
        "startChars": "{",
        "endChars": "}"
      },
      "\\begin{figure}": {
        "jsx": this._figureToJSX,
        "props": ["noborder"], // true - false
        "startChars": "",
        "endChars": "\\end{figure}"
      },
      "\\begin{video}": {
        "jsx": this._videoToJSX,
        "props": ["noborder"], // noborder=true/false 
        "startChars": "",
        "endChars": "\\end{video}"
      },
      "\\list": {
        "jsx": this._listToJSX,
        "props": [], 
        "startChars": "{",
        "endChars": "}"
      },
      "\\newline": { // Hello world! \newline Today is a beautiful day!
        "jsx": this._newlineToJSX,
        "props": [], 
        "startChars": "",
        "endChars": ""
      },
      "\\textbf": { // hello \textbf{world}, it's me!
        "jsx": this._bfToJSX,
        "props": [], 
        "startChars": "{",
        "endChars": "}"
      },
      "\\textit": { // hello \textit{world}, it's me!
        "jsx": this._itToJSX,
        "props": [], 
        "startChars": "{",
        "endChars": "}"
      },
      "\\hyperlink": { // hello \hyperlink[url=http://...]{world}, it's me!
        "jsx": this._hyperLinkToJSX, 
        "props": ["url"],  // url=http://google.com
        "startChars": "{",
        "endChars": "}"
      },
      "\\glqq": { 
        "jsx": this._glqqToJSX,
        "props": [],  
        "startChars": "",
        "endChars": ""
      },
      "\\grqq": { 
        "jsx": this._grqqToJSX,
        "props": [], 
        "startChars": "",
        "endChars": ""
      },
      "\\hr": { 
        "jsx": this._hrToJSX,
        "props": [], 
        "startChars": "",
        "endChars": ""
      },
      "\\circuit": { 
        "jsx": this._circuitToJSX,
        "props": ["name", "inline", "editable", "results"], // name=circuit1 , inline=true, editable=true, results=true
        "startChars": "{",
        "endChars": "}"
      },
      "\\includeHTML": { 
        "jsx": this._includeHTML,
        "props": [], //
        "startChars": "{",
        "endChars": "}"
      },
      "\\includeScript": { 
        "jsx": this._scriptToJSX,
        "props": ["name"], // name=bb84_script
        "startChars": "{",
        "endChars": "}"
      },
      "\\exercise": { 
        "jsx": this._exerciseToJSX,
        "props": ["type"], // type=["multipleChoice", "trueFalse", "shortAnswer"]
        "startChars": "{",
        "endChars": "}"
      },
    };
  }
  

  //
  // Parser function
  //


  public convertLatexToJSX = async (latex: string): Promise<JSX.Element | ErrorDto> => { 
    let latexAndJSXeles: (string | JSX.Element)[] = [latex];
    // loop through special components
    for (const key in this.specialComponents) {
      // always create a new latex ele list in each loop
      // because some eles might get split again
      let newLatexAndJSXeles: (string | JSX.Element)[] = [];

      // loop through elements
      for (let i = 0; i < latexAndJSXeles.length; i++) {

        // skip if element is jsx and not a string
        if (!this._isString(latexAndJSXeles[i])) {
          newLatexAndJSXeles.push(latexAndJSXeles[i]);
          continue;
        }
        const currentElement: string = latexAndJSXeles[i] as string;
        // split current element in list of latex and jsx special elements
        const extraction = await this._recursiveExtractComponent(currentElement, key, this.specialComponents);
        if (extraction instanceof ErrorDto) {
          return extraction;
        }
        newLatexAndJSXeles = newLatexAndJSXeles.concat(extraction);
      }
      latexAndJSXeles = newLatexAndJSXeles;
    }
    return <>
      {latexAndJSXeles.map((ele: string | JSX.Element, index: number) => {
        if (this._isString(ele)) {
          this.totalMathjax++;
          return <MathJax 
            style={{display: "unset", position: "unset"}} 
            key={index}
            onTypeset={() => {this._increaseLoadedMathJax();}}
            >{ele}
          </MathJax>
        }
        return <span key={index}>{ele}</span>;
      })}
    </>
  }



  //
  // Parser helpers
  //


  private _isString = (ele: any): boolean => {
    return (typeof ele=== 'string' || ele instanceof String);
  } // end of _isString

  private _splitAtFirstOccurence = (str: string, chars: string): [string, string] => {
    if (!!!str.includes(chars)) {
      return ["", str];
    }
    const [first, ...rest] = str.split(chars);
    return [first, rest.join(chars)];
  } // end of _splitAtFirstOccurence

  private _propsListToObject = (propsList: string[]): {[key: string]: string} => {
    const propsObject: {[key: string]: string} = {};
    for (let i = 0; i < propsList.length; i++) {
      const [key, value] = this._splitAtFirstOccurence(propsList[i], "=");
      propsObject[key] = value;
    }
    return propsObject;
  } // end of _propsListToObject

  private _recursiveExtractComponent = async (currentElement: string, key: string, specialComponents: any): Promise<(JSX.Element | string)[] | ErrorDto> => {
    // termination condition: no more special components are found
    if (!currentElement.includes(key)) {
      return [currentElement];
    }
    // currentElement = "Here is some text. \\section{Hello} Here is some more \\section{Hello} text."
    const split = this._splitAtFirstOccurence(currentElement, key);
    // split = ["Here is some text. ", "{Hello} Here is some more text."]
    // split 2nd element in order to extract special component
    const endChars = specialComponents[key]["endChars"];
    const startChars = specialComponents[key]["startChars"];
    // check if props are defined
    let props: string[] = [];
    let stringWithComponent = split[1];
    // if props are defined and given, extract them
    if (specialComponents[key]["props"].length > 0 && stringWithComponent.startsWith("[")) {
      const extracedProps = this._extractComponent(key, stringWithComponent, "[", "]");
      // [component, rest]
      // extracted = ["Hello", " Here is some more text."]
      if (extracedProps instanceof ErrorDto) {
        return extracedProps;
      }
      // case 1: single prop
      if (!!!extracedProps[0].includes(",")) {
        props = [extracedProps[0]];
      } else { // case 2: multiple props
        props = extracedProps[0].split(",");
      }
      // verify props
      for (let i = 0; i < props.length; i++) {
        if (!props[i].includes("=")) {
          return new ErrorDto("Invalid properties.", `${key} has invalid props: '${props[i]}'. Valid props are '${specialComponents[key]["props"]}'.`);;
        }
        const propName = props[i].split("=")[0];
        if (!!!specialComponents[key]["props"].includes(propName)) {
          return new ErrorDto("Invalid properties.", `${key} has invalid props: '${props[i]}'. Valid props are '${specialComponents[key]["props"]}'.`);;
        }
      } // end of props verification
    } // end of props extraction
    const extracted = this._extractComponent(key, stringWithComponent, startChars, endChars);
    // [component, rest]
    // extracted = ["Hello", " Here is some more text."]
    if (extracted instanceof ErrorDto) {
      return extracted;
    }
    const extractedJSX: JSX.Element = await specialComponents[key]["jsx"](extracted[0], this._propsListToObject(props));
    // extractedJSX = <h2>Hello</h2>
    // continue recursive extraction
    const nextExtraction = await this._recursiveExtractComponent(extracted[1], key, specialComponents);
    if (nextExtraction instanceof ErrorDto) {
      return nextExtraction;
    }
    // merge recursion results
    return [split[0], extractedJSX, ...nextExtraction];
  } // end of _recursiveExtractComponent

  private _extractComponent = (key: string, latex: string, startChars="{", endChars="}"): [string, string] | ErrorDto => {
    // latex e.g.: "{Problem} zu ..." --> return ["Problem", " zu ..."]
    // use depth in order to extract the correct component in case there are nested components
    if (startChars.length === 1 && endChars.length === 1) {
      let depth = 0;
      if(!!!latex) return new ErrorDto("Invalid latex.", `${key} has invalid latex: '${latex}'.`);
      for (let i = 0; i < latex.length; i++) {
        if (latex[i] === startChars) {
          depth++;
        } else if (latex[i] === endChars) {
          depth--;
          if (depth === 0) {
            // usually first substring would be (0, i+1) but we want to remove the '{' and '}'
            return [latex.substring(latex.indexOf(startChars)+1, i), latex.substring(i+1)];
          }
        }
      }
      return new ErrorDto("Cannot find closing character(s)", `Cannot find the closing character(s) '${endChars}' for start character(s) '${startChars}' at component '${key}'. Please check your LaTeX code.`);
    }
    if (startChars.length === 0 && endChars.length > 1) {
      if (latex.includes(endChars)) {
        const splitted = this._splitAtFirstOccurence(latex, endChars);
        return [splitted[0], splitted[1]];
      }
      return new ErrorDto("Cannot find closing character(s)", `Cannot find the closing character(s) '${endChars}' for start character(s) '${startChars}' at component '${key}'. Please check your LaTeX code.`);
    }
    if (startChars.length === 0 && endChars.length === 0) {
      return ["", latex];
    }
    return new ErrorDto("Invalid ending char configuration", "Invalid ending char configuration. Please check the component configuration inside the code.");
  } // end of _extractComponent



  //
  //  JSX Templates
  //


  private _subSubSectionToJSX = (subSubSection: string, props: {[key: string]: string}): JSX.Element => {
    const style = {"textAlign": (props["align"] ? props["align"] : "left") as "left" | "center" | "right"};
    return <h1 key="subsubsection" style={style} className="lead">{subSubSection}</h1>;
  } // end of _subSubSectionToJSX
  
  private _subSectionToJSX = (subSection: string, props: {[key: string]: string}): JSX.Element => {
    const style = {"textAlign": (props["align"] ? props["align"] : "left") as "left" | "center" | "right"};
    return <h1 key="subsection" style={style} className="display-6">{subSection}</h1>;
  } // end of _subSectionToJSX
  
  private _sectionToJSX = (section: string, props: {[key: string]: string}): JSX.Element => {
    const style = {"textAlign": (props["align"] ? props["align"] : "left") as "left" | "center" | "right"};
    return <h1 key="section" style={style} className="display-4">{section}</h1>
  } // end of _sectionToJSX
  
  private _bfToJSX = (bf: string, props: {[key: string]: string}): JSX.Element => {
    return <b key="textbf">{bf}</b>;
  } // end of _bfToJSX
  
  private _itToJSX = (it: string, props: {[key: string]: string}): JSX.Element => {
    return <i key="textit">{it}</i>;
  } // end of _itToJSX

  private _hyperLinkToJSX = (hyperLink: string, props: {[key: string]: string}): JSX.Element => {
    const url = props["url"] ? props["url"] : "/";
    return <a key="hyperlink" href={url} target="_blank" rel="noreferrer">{hyperLink}</a>;
  } // end of _hyperLinkToJSX
  
  private _newlineToJSX = (newline: string, props: {[key: string]: string}): JSX.Element => {
    return <br key="newline"/>;
  } // end of _newlineToJSX
  
  private _glqqToJSX = (glqq: string, props: {[key: string]: string}): JSX.Element => {
    return <span key="glqq">&#8222;</span>;
  } // end of _glqqToJSX

  private _grqqToJSX = (grqq: string, props: {[key: string]: string}): JSX.Element => {
    return <span key="grqq">&#8220;</span>;
  } // end of _grqqToJSX

  private _hrToJSX = (hr: string, props: {[key: string]: string}): JSX.Element => {
    return <hr key="hr"/>;
  } // end of _hrToJSX

  private _exerciseToJSX = (exercise: string, props: {[key: string]: string}): JSX.Element => {
    // props: type=["multipleChoice", "trueFalse", "shortAnswer"] --> check
    if (!!!props["type"] || !!!["multipleChoice", "trueFalse", "shortAnswer"].includes(props["type"])) {
      return <p className="lead text-danger">Invalid Exercise type. Valid types are: multipleChoice, trueFalse, shortAnswer.</p>
    }

    const question = this._extractComponent("\\question", exercise.split("\\question")[1], "{", "}");
    if (question instanceof ErrorDto) return <p className="lead text-danger">Error at extracting question: {question.message}</p>

    const result = this._extractComponent("\\result", exercise.split("\\result")[1], "{", "}");
    if (result instanceof ErrorDto) return <p className="lead text-danger">Error at extracting result: {result.message}</p>

    switch (props["type"]) {

      case "multipleChoice": // question, possibleAnswers, result
        const possibleAnswers = this._extractComponent("\\possibleAnswers", exercise.split("\\possibleAnswers")[1], "{", "}");
        if (possibleAnswers instanceof ErrorDto) return <p className="lead text-danger">Error at extracting possibleAnswers: {possibleAnswers.message}</p>
        let possibleAnswersList = possibleAnswers[0].split("\\item");
        if (possibleAnswersList.length < 1) return <p className="lead text-danger">Empty list, did not find any \item elements in possible answers.</p>
        possibleAnswersList = possibleAnswersList.splice(1);
        if (isNaN(Number(result[0])) || Number(result[0]) > possibleAnswersList.length) return <p className="lead text-danger">Invalid result index. Result index must be a number between 1 and the number of possible answers.</p>
        const evaluate = (answer: number, event: React.MouseEvent<HTMLElement>) => {
          if (answer === Number(result[0])) {
            event.currentTarget.classList.add("text-success");
          } else {
            event.currentTarget.classList.add("text-danger");
          }
        }
        this.totalMathjax++;
        return <div key="exercise">
          <p className="lead"><MathJax onTypeset={() => {this._increaseLoadedMathJax();}}>{question[0]}</MathJax></p>
          <div className="list-group">
            {possibleAnswersList.map((item, index) => {
              this.totalMathjax++;
              return <div key={index} 
                onClick={(event) => evaluate(index+1, event)} 
                className="list-group-item list-group-item-action"
                style={{cursor: "pointer"}}
                >
                <MathJax onTypeset={() => {this._increaseLoadedMathJax();}}>{item}</MathJax>
              </div>
            })}
          </div>
        </div>

      case "trueFalse": // question, result
        const evaluateTrueFalse = (answer: number, event: React.MouseEvent<HTMLElement>) => {
          if (answer === Number(result[0])) {
            event.currentTarget.classList.add("text-success");
          } else {
            event.currentTarget.classList.add("text-danger");
          }
        }
        if (isNaN(Number(result[0])) || Number(result[0]) > 1) return <p className="lead text-danger">Invalid result index. Result index must be either 0 for false or 1 for true.</p>
        this.totalMathjax++;
        return <div key="exercise">
          <p className="lead"><MathJax onTypeset={() => {this._increaseLoadedMathJax();}}>{question[0]}</MathJax></p>
          <div className="list-group">
            {["Nein", "Ja"].map((item, index) => {
              return <div key={index} 
                onClick={(event) => evaluateTrueFalse(index, event)} 
                className="list-group-item list-group-item-action"
                style={{cursor: "pointer"}}
                >
                {item}
              </div>
            })}
          </div>
        </div>

      case "shortAnswer": // question, result
        return <div key="exercise">
          <p className="lead">shortAnswer not implemented yet</p>
        </div>
    }
    return <p className="lead text-danger">Invalid Exercise</p>
  } // end of _exerciseToJSX

  private _includeHTML = async (htmlPath: string, props: {[key: string]: string}): Promise<JSX.Element> => {
    const res = await fetch(`${this.publicURL}/pages/${this.pageID}/${htmlPath}`, {
      headers: { 
          'Content-Type': 'application/json',
          'Accept': 'text/plain'
      }
    });
    if (res.status !== 200) return <p className="lead text-danger">Error fetching HTML file.</p>
    const innerHTMLObj = {__html: await res.text()};
    return <div key="includeHTML">
      <div dangerouslySetInnerHTML={innerHTMLObj}/>
    </div>;
  } // end of _hrToJSX

  private _scriptToJSX = (scriptPath: string, props: {[key: string]: string}) => {
    if (!!!props["name"]) return <p className="lead text-danger">Property 'name' is required on element 'script'.</p>
    // register new script
    const script = document.createElement('script');
    const container = document.getElementsByTagName("body")[0] as HTMLElement;
    script.src = `${this.publicURL}/pages/${this.pageID}/${scriptPath}`;
    script.className = "manualScript";
    container.append(script);
    // add loading event listener to access script content
    script.addEventListener('load', () => {
      // const scriptContainer: HTMLElement = document.getElementById("script_"+props["name"]) as HTMLElement;
      // const scriptObject = (window as any)[props["name"]];
      // const scriptElement: HTMLElement = scriptObject.toDom();
    });
    // return jsx
    return <div key="script">
      <div id={"script_"+props["name"]}></div>
    </div>
  }

  private _circuitToJSX = (circuitPath: string, props: {[key: string]: string}) => {
    if (!!!props["name"]) return <p className="lead text-danger">Property 'name' is required on element 'circuit'.</p>
    let inline = false;
    if (props["inline"] && props["inline"] === "true") inline = true;
    let editable = false;
    if (props["editable"] && props["editable"] === "true") editable = true;
    let results = false;
    if (props["results"] && props["results"] === "true") results = true;
    // register new circuit
    const script = document.createElement('script');
    const container = document.getElementsByTagName("body")[0] as HTMLElement;
    script.src = `${this.publicURL}/pages/${this.pageID}/${circuitPath}`;
    script.className = "manualScript";
    container.append(script);
    // add loading event listener to access script content
    script.addEventListener('load', () => {
      const circuitContainer: HTMLElement = document.getElementById("circuit_"+props["name"]) as HTMLElement;
      const circuitObject = (window as any)[props["name"]];
      const circuitElement: HTMLElement = circuitObject.toDom();
      if (!!!editable) circuitElement.removeChild(circuitElement.firstChild as Node); // remove circuit header
      circuitElement.removeChild(circuitElement.lastChild as Node);
      if (!!!editable) circuitElement.classList.add("Q-circuit-locked"); // lock circuit
      circuitContainer.removeChild(circuitContainer.firstChild as Node);
      circuitContainer.appendChild(circuitElement);
      
      // remove max-height
      (circuitContainer.firstChild?.firstChild as HTMLElement).setAttribute("style", "max-height: unset;"); 

      let output: any;
      if (results) {
        output = document.createElement("div");
        output.innerHTML = "<p class=''>Mögliche Ergebnisse bei einer Messung:</p>"+circuitObject.report$().replaceAll("chance", "<br>");
        circuitContainer.appendChild(output);
      }
      // update output on circuit change
      if (editable) {
         // add palette loader
         const paletteLoader = document.createElement("script");
         paletteLoader.innerHTML = `Q.Circuit.Editor.createPalette(document.getElementById("palette_${props["name"]}"));`;
         container.append(paletteLoader);
        // update output on circuit change
        if (results) {
          (circuitElement.lastChild?.firstChild?.lastChild as Node).addEventListener("DOMSubtreeModified", () => {
            circuitObject.evaluate$();
            output.innerHTML = "<p class=''>Mögliche Ergebnisse bei einer Messung:</p>"+circuitObject.report$().replaceAll("chance", "<br>");
          });
        }
      }
    });
    // return jsx
    return <div key="circuit" className="border border-2 border-secondary rounded d-flex flex-column" >
      <div className='Q-circuit-palette ms-5 ps-2 mt-3' id={"palette_"+props["name"]}></div>
      <div 
        id={"circuit_"+props["name"]} 
        style={inline ? {
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
        } : {}}
        >
          <span>Circuit is Loading...</span>
        </div>
    </div>
  }
  
  private _listToJSX = (list: string, props: {[key: string]: string}): JSX.Element => {
    let items = list.split("\\item");
    if (items.length < 2) return <p className="lead text-danger">Empty list, did not find any \item elements.</p>
    items = items.splice(1);
    return <ul key="list" className="my-2">
      {items.map((item: string, index: number) => {
        return <li key={index}>{item}</li>;
      }
      )}
    </ul>
  } // end of _listToJSX

  private _figureToJSX = (figure: string, props: {[key: string]: string}): JSX.Element => {
    const figError = <p className="lead text-danger">{"Error in figure. Please make sure it contains ' \\includegraphics[width=$WIDTH_IN_PERCENT$]{$PATH_TO_IMG$} '"}</p>;
    // get include graphics properites
    if (figure.includes("\\includegraphics")) {
      // get width property
      const rawWidth = this._extractComponent("\\includegraphics", figure.split("\\includegraphics")[1], "[", "]");
      if (rawWidth instanceof ErrorDto || !rawWidth[0].includes("=")) return figError
      const width = rawWidth[0].split("=")[1];
      if (isNaN(parseInt(width))) return figError
      // get src property
      const src = this._extractComponent("\\includegraphics", figure.split("\\includegraphics")[1], "{", "}");
      if (src instanceof ErrorDto) return figError
      // get caption
      let caption = null;
      if (figure.includes("\\caption")) {
        caption = this._extractComponent("\\caption", figure.split("\\caption")[1], "{", "}");
        if (caption instanceof ErrorDto) return <p className="lead text-danger">{JSON.stringify(caption)}</p>;
      }
      this.totalMathjax++;
      let noborder = false;
      if (props["noborder"] && props["noborder"] === "true") noborder = true;
      return <div key="figure" className="d-flex flex-column align-items-center my-3">
        <img 
          className={noborder ? "" : "border border-4 rounded"} 
          src={`${this.publicURL}/pages/${this.pageID}/${src[0]}`} 
          style={{width: width+"%"}} alt="Figure" 
        />
        {caption !== null && <MathJax style={{position: "unset"}} onTypeset={() => {this._increaseLoadedMathJax();}} className="text-secondary px-5">{caption[0]}</MathJax>}
      </div>
    } else {
      return figError
    }
  } // end of _figureToJSX

  private _videoToJSX = (video: string, props: {[key: string]: string}): JSX.Element => {
    const vidError = <p className="lead text-danger">{"Error in video. Please make sure it contains ' \\includegraphics[width=$WIDTH_IN_PERCENT$]{$PATH_TO_VIDEO$} '"}</p>;
    // get include graphics properites
    if (video.includes("\\includegraphics")) {
      // get width property
      const rawWidth = this._extractComponent("\\includegraphics", video.split("\\includegraphics")[1], "[", "]");
      if (rawWidth instanceof ErrorDto || !rawWidth[0].includes("=")) return vidError
      const width = rawWidth[0].split("=")[1];
      if (isNaN(parseInt(width))) return vidError
      // get src property
      const src = this._extractComponent("\\includegraphics", video.split("\\includegraphics")[1], "{", "}");
      if (src instanceof ErrorDto) return vidError
      // get caption
      let caption = null;
      if (video.includes("\\caption")) {
        caption = this._extractComponent("\\caption", video.split("\\caption")[1], "{", "}");
        if (caption instanceof ErrorDto) return <p className="lead text-danger">{JSON.stringify(caption)}</p>
      }
      this.totalMathjax++;
      let noborder = false;
      if (props["noborder"] && props["noborder"] === "true") noborder = true;
      return <div key="video" className="d-flex flex-column align-items-center my-3">
        <video 
          src={`${this.publicURL}/pages/${this.pageID}/${src[0]}`} 
          style={{width: width+"%"}} 
          className={noborder ? "" : "border border-4 rounded"} 
          controls
        />
        {caption !== null && <MathJax style={{position: "unset"}} onTypeset={() => {this._increaseLoadedMathJax();}} className="text-secondary px-5">{caption[0]}</MathJax>}
      </div>
    } else {
      return vidError
    }
  } // end of _videoToJSX



  //
  // other helper functions
  //

  // tracks how many mathjax elements have been loaded
  // fires callback when all mathjax elements have been loaded
  private _increaseLoadedMathJax() {
    this.loadedMathJax++;
    if (this.loadedMathJax === this.totalMathjax) {
      this.onFinishLoading();
    }
  }

}