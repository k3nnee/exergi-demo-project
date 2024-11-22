import Chat from "./Components/Chat";
import Navbar from "./Components/Navbar";

function App() {

  return (
    <>
        <div className="w-100 vh-100" style = {{backgroundColor: "#eeeee8"}}>
            <Navbar />
            <div className="w-100 d-flex justify-content-center pt-2">
                <Chat />
            </div>
        </div>
    </>
  );
}

export default App;
