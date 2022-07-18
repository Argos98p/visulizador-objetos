import './App.css';
import React360Viewer from "react-360-view";
function App() {
  var visualizerContainer={width:"38%", };
  return (
    <div className="container">
      <div className="row" style={{textAlign:"center"}}>
        <div className="col-12 mb-4 card p-0"  style={{textAlign:"center", margin: "auto",
  width: "65%"}}>
          
          <div className="card" style={visualizerContainer}>
          <React360Viewer
            amount={114}
            imagePath={`./img/`}
            fileName="control_{index}.jpg"
            buttonClass="ligth"
          />
          </div>
          
        </div>
      </div>
      
    </div>
  );
}

export default App;
