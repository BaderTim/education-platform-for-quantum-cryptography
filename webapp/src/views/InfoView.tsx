import { MathJax, MathJaxContext } from "better-react-mathjax";
import React from "react";
import { Link } from "react-router-dom";
import { PageLocation } from "../components/PageLocation";

export default class SettingsView extends React.Component<{}, {}> {

  render() {

    return <div className="mb-5 mt-3">
      <PageLocation paths={["info"]} pathTitles={["Informationen"]} />

      <h1 className="display-1">Über das Projekt</h1>
      <p> Das Projekt ist im Rahmen einer Studienarbeit an der Dualen Hochschule Baden-Württemberg entstanden. Es handelt sich um eine Bildungsplatform für Quantenkryptografie, die sich speziell an Studierende ohne Vorkenntnisse in diesem Bereich richtet. Unser Ziel ist es hiermit den Einstieg in die Quanteninformatik zu erleichtern.  <br /> </p>

      <h3 className="display-3">Hinweise zur Benutzung</h3>
      Die Anwendung setzt auf interaktives Lernen. Dies gelingt durch die Kombination von Text, Formeln, Bildern, Videos und interaktiven Elementen. Der Lernfortschritt und die Einstellungen werden ausschließlich lokal im Webbrowser gespeichert.
      Optional gibt es die Möglichkeit über einen Live Chat die GPT-3 KI zu befragen.<br />
      Weitere Informationen zu den verschiedenen Elementen innerhalb der Plattform sind im <Link to={`/chapter/${1}`}>ersten Kapitel</Link> zu finden.

      <h3 className="display-3">Hinweise zur Administration</h3>
      Dieses Kapitel enthält alle wesentlichen Information zur Verwaltung der Anwendung, insbesondere im Hinblick der Erstellung und Erweiterung von Kapiteln. <br />

      <h4 className="display-4">Anwendung lokal bereitstellen</h4>

      <h5>1. Download des Webservers</h5>
      Für die lokale Nutzung wird der Apache Webserver von <a href="https://www.apachefriends.org/de/download.html" target="_blank" rel="noreferrer">XAMPP</a> empfohlen. Bei der portablen Version von XAMPP ist keine Installation erforderlich. In diesem Fall muss das heruntergeladene Verzeichnis lediglich entpackt werden.

      <h5>2. fertigen Build der Anwendung herunterladen</h5>
      Der Build der Webseite kann <a href="https://github.com/BaderTim/education-platform-for-quantum-cryptography/releases/download/release-build/release-build.zip" target="_blank" rel="noreferrer">hier</a> heruntergeladen werden. <br /> Der Quellcode der Anwendung ist auf <a href=" https://github.com/BaderTim/education-platform-for-quantum-cryptography" target="_blank">GitHub</a> verfügbar.


      <h5>(optional) Anwendung selbst bauen</h5>
      Die Anwendung kann auch selbst kompiliert und lokal getestet werden. Diese Option ist insbesondere für Entwickler gedacht. Für diesen optionalen Schritt muss Node.js auf dem System installiert sein. <br />
      Zunächst wird das Repository gecloned und die Abhängigkeiten installiert. <br />

      <code>
        git clone https://github.com/BaderTim/education-platform-for-quantum-cryptography.git
        <br />
        cd education-platform-for-quantum-cryptography/webapp/
        <br />
        npm install
      </code><br />


      Danach kann mit <code>npm start</code> der Entwickler Server lokal gestartet werden.
      Der Build wird mit dem Befehl <code>npm run build</code> gestartet. Die Dateien befinden sich nach Abschluss im Ordner <code>build</code>. <br />

      <h5>3. Anwendung auf lokalem Webserver starten</h5>
      <b>Microsoft Windows</b>< br />
      Falls der build Ordner heruntergeladen wurde muss dieser ggf. entpackt werden. Der Inhalt des build Ordners muss dann in das XAMPP-Verzeichnis <code> xampp-portable-XXXXX\xampp\htdocs\ </code> kopiert werden. Bestehende Dateien im Verzeichnis sollten vorher komplett gelöscht werden.<br />
      Nun sollte der Apache Webserver gestartet werden. Dies geschieht über das Skript <code>apache_start.bat</code>. Zum Beenden von Apache bzw. XAMPP muss das Skript <code>xampp_stop.exe</code> verwendet werden. Der aktuelle Status kann über das XAMPP-Dashboard <code>xampp-control.exe </code> überprüft werden. <br />
      Die Anwendung kann dann im Browser lokal unter <a href="http://localhost:80" target="_blank" rel="noreferrer">http://localhost:80</a> aufgerufen werden. <br />

      <b>Linux</b>< br />
      In Kürze wird hier die Anleitung für Linux Distributionen veröffentlicht. <br />



      <h1 className="display-4">Inhalte hinzufügen und bearbeiten</h1>

      <p>
        Um eine neues Kapitel hinzuzufügen sind folgende Schritte notwendig: <br />

        1. neuen Ordner (Kapitel Nummer als Ordnername) erstellen in <code> webapp/public/pages/</code><br />
        2. im Kapitelordner einen Unterordner <code>/content/</code> erstellen <br />
        3. .tex Datei erstellen: <code>latex_page.tex</code><br />
        4. .json Datei erstellen: <code>page.json</code><br />
        5. (optional) Menü Icons einfügen als .png Dateien: Benennung <code>id-uf.png</code> für nicht abgeschlossene Kapitel und <code>id-fin.png</code> für abgeschlossene Kapitel. <br />

      </p>

      <h4>Verwendung des Ordners <i>/content/</i></h4>
      Jeder Kapitelordner enthält einen einzigen Unterordner <code>/content/</code>.<br />
      Dieser muss alle benötigten Medieninhalte und Skriptdateien enthalten, damit diese mittels der entsprechenden Befehle dann auf der Webseite verwendet werden können. <br />

      <h4>Aufbau der Datei <i>page.json</i></h4>
      Im Feld <code>id</code> wird die ID der Seite festgelegt. Diese muss fortlaufend und identisch zum Ordnernamen sein. Bei <code>title</code> wird die Bezeichnung des Kapitels als Text eingetragen.
      <br />

      <code>

        {"{"}
        <br />
        "id": 1,<br />
        "title": "Titelbezeichnung"
        <br />
        {"}"}

      </code>
      <br /><br />
      <h4>Unterstützte Befehle innerhalb der Datei <i>latex_page.tex</i></h4>
      Die Datei <i>latex_page.tex</i> beschreibt alle Inhalte einer Seite. Es werden verschiedene Befehle unterstützt, die die Inhalte einer Seite definieren.

      <h5>interaktive Funktionen </h5>

      <b>Quantenschaltungen durch Q.js Plugin</b>< br />
      Es besteht die Möglichkeiten Quantenschaltungen innerhalb eines Kapitels zu simulieren. Dafür wird das Plugin <code>Q.js</code> verwendet. Dieses Plugin ermöglicht es, die Quantenschaltungen durch ein HTML-Element zu simulieren. <br />
      Weiterführende Informationen lassen sich der <a href="https://quantumjavascript.app/Q.html" rel="noreferrer" target="_blank">Dokumentation</a> entnehmen.
      <br />
      Die Schaltung selbst wird als <code>.js</code> Datei im Ordner <code>/content/</code> des jeweiligen Kapitels gespeichert.

      <br />

      Beispiel für den Inhalt der <code>circuit1.js</code> Datei: <br />

      <code>
        var circuit1 = Q`<br />
        I-X#1<br />
        H-X#0<br />
        `<br />

      </code><br />

      Die Schaltung kann innerhalb der latex_page.tex Datei wie folgt eingebunden werden: <br />

      <code>
        \circuit[name=circuit1,inline=true,editable=true,results=true]{"{content/circuit1.js}"} <br />

      </code>

      Der <code>name</code> muss angegeben werden und identisch mit dem Variablennamen innerhalb der <code>.js</code> Datei sein.
      Der Parameter <code>inline</code> muss auf <code>true</code> oder <code>false</code> gesetzt werden, je nachdem, ob die Schaltung ein inline Element sein soll. Der Parameter <code>editable</code> muss ebenfalls auf <code>true</code> oder <code>false</code> gesetzt werden, je nachdem, ob die Schaltung durch den Nutzer editierbar sein soll. Der Parameter <code>results</code> muss ebenfalls auf <code>true</code> oder <code>false</code> gesetzt werden, je nachdem, ob die Ergebnisse der Schaltung angezeigt werden sollen.
      Zusätzlich muss der Pfad der Schaltung, also der <code>circuit.js</code> Datei angegeben werden.



      <br /><br />
      <b>Verwendung von JavaScript und HTML innerhalb der Kapitelseite</b>< br />

      Es besteht die Möglichkeit, JavaScript und HTML Code innerhalb eines Kapitels zu verwenden. Dafür muss die <code>.html </code> bzw. <code>.js </code> Datei im Ordner <code>/content/ </code> abgelegt werden. Innerhalb der <code>latex_page.tex</code> können die Skripte nun mit den folgenden Befehlen eingefügt werden. Zusätzlich zum Dateipfad muss auch ein Name definiert werden. <br />
      Beispiel für HTML: <br />
<code>\includeHTML[name=html1]{"{content/test.html}"} </code><br />

<br />
Beispiel für JavaScript: <br /><code>
 \includeScript[name=test1]{"{content/test.js}"}</code>
      
    
      <br /><br />



      <b>Erstellung von Aufgaben</b>< br />
      Es werden zwei Arten von Aufgabenstellungen unterstützt:

      <br /> Ja/Nein Fragen: <code>trueFalse</code>
      <br />  Multiple Choice Fragen: <code>multipleChoice</code><br />
      <br />


      Beispielcode für Ja/Nein Aufgabenstellung: <br />    
      <code>
        \exercise[type=trueFalse]{"{"}</code><span className="user-select-none"> Fragentyp definieren</span> <br />

      <code> \question{"{Ist die Erde flach?}"}</code><span className="user-select-none"> Frage festlegen</span> <br />


      <code>\result{"{"}2{"}"}</code><span className="user-select-none"> richtige Antwort festlegen: Nein = 0, Ja = 1</span> <br />
      <code>{"}"}</code>

      <br />    <br />

      Beispielcode für Multiple Choice Aufgabenstellung: <br />   
      <span className="ml-4">
      <code>
        \exercise[type=multipleChoice]{"{"}</code><span className="user-select-none"> Fragentyp definieren: </span> <br />

      <code> \question{"{Was ist ein Quantencomputer?}"}</code><span className="user-select-none"> Frage festlegen</span> <br />

      <code>\possibleAnswers{"{"}</code><span className="user-select-none"> Lösungemöglichkeiten festlegen</span> <br />
      <code> \item Antwort 1 ist falsch <br />
        \item Anwort 2 ist richtig<br />
        \item Antwort 3 ist falsch<br />
        \item Antwort 4 ist falsch
        <br />

        {"}"} <br /></code>
      <code>\result{"{"}2{"}"}</code><span className="user-select-none"> richtige Antwort festlegen </span> <br />
      <code>{"}"}</code>

      <br />
      </span>




      < br />< br />

      <h5>Formatierung und Inhalt</h5>

      Innerhalb der Datei <code> latex_page.tex</code> können die folgenden Befehle verwendet werden:
      <div className="table-responsive text-center">
        <table className="table table-striped table-hover align-middle">

          <thead>
            <tr>
              <th scope="col">Beschreibung</th>
              <th scope="col">Befehl</th>
              <th scope="col">Beispiel</th>

            </tr>
          </thead>
          <tbody>

            <tr>
              <td> kursiver Text </td>
              <td> \textit{"{kursiv}"} </td>
              <td> <i>kursiv </i></td>



            </tr>
            <tr>
              <td> fetter Text </td>
              <td> \textbf{"{fett}"} </td>
              <td> <b>fett</b> </td>

            </tr>




            <tr>
              <td> Überschrift 1</td>
              <td> \section{"{Überschrift}"} </td>
              <td><h1>Überschrift</h1></td>

            </tr>

            <tr>
              <td> Überschrift 2</td>
              <td> \subsection{"{Überschrift}"} </td>
              <td><h2>Überschrift</h2></td>

            </tr>



            <tr>
              <td>Überschrift 3</td>
              <td> \subsubsection{"{Überschrift}"} </td>


              <td><h3>Überschrift</h3></td>

            </tr>

            <tr>
              <td>Ausrichtung der Überschriften </td>
              <td> \section<b>[align= left | middle | right]</b>{"{Überschrift}"} </td>
              <td><h1>Überschrift</h1></td>

            </tr>

            <tr>
              <td> Horizontale Linie </td>
              <td> \hr </td>
              <td> <hr></hr> </td>


            </tr>

            <tr>
              <td> Anführungszeichen </td>
              <td>
                \glqqDas ist ein Zitat\grqq</td>

              <td> <span key="glqq">&#8222;</span>Das ist ein Zitat<span key="glqq">&#8220;</span>  </td>


            </tr>

            <tr>
              <td> Absatz einfügen </td>
              <td> \newline </td>
              <td> 1. Zeile <br></br> 2. Zeile  </td>

            </tr>
            <tr>
              <td> Link einfügen </td>
              <td> \hyperlink[url=https://www.dhbw.de/]{"{Webseite}"} </td>
              <td> <a key="hyperlink" href="https://www.dhbw.de/" target="_blank" rel="noreferrer">Webseite</a> </td>

            </tr>


            <tr>
              <td> Liste einfügen </td>
              <td> \list{"{\\item erstens \\item zweitens}"}</td>
              <td> <ul key="list" className="my-2"></ul>
                <li key="index">erstens</li><li key="index">zweitens</li>

              </td>




            </tr>


            <tr>
              <td> Bild einfügen (.jpg/.png) </td>
              <td> \includegraphics[width=42]{"{content/DATEINAME.XYZ}"} </td>
              <td>  </td>



            </tr>

            <tr>
              <td> Video einfügen (.mp4) </td>
              <td> \includegraphics[width=84]{"{content/DATEINAME.XYZ}"} </td>
              <td>  </td>



            </tr>
            <tr>
              <td> Bildunterschrift  </td>
              <td>
                \caption{"{Quantum Fourier Transformation Circuit}"} </td>

              <td><p className="text-secondary px-5">Quantum Fourier Transformation Circuit </p>
              </td>
            </tr>





            <tr>

              <td> mathematische Formel</td>

              <td> {" \\begin{equation}\\begin{gathered}   1 + 1 = 2 \\end{gathered}\\end{equation}"}  </td>

              <td><MathJaxContext>
                <MathJax> {" \\begin{equation}\\begin{gathered}  1 + 1 = 2 \\end{gathered}\\end{equation}  "} </MathJax></MathJaxContext>
              </td>

            </tr>

          </tbody>

        </table>
      </div></div >
  }

}