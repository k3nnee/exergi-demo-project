import {useEffect, useRef, useState} from "react";

const Chat = () => {
    const [chat_log, set_chat_log] = useState([{role: "system", message: "Start off by letting me know which solar panel model you are interested in. I can also give you suggestions🙂! Based on your location and solar panel model, I will calculate your savings!"}]);
    const [input, set_input] = useState("");
    const [loading, set_loading] = useState(false);
    const overflowDivRef = useRef(null);

    const on_submit = async (e) => {
        e.preventDefault();
        set_chat_log((prevState) => [...prevState, {role: "user", message: input.replace(/(<([^>]+)>)/ig, '')}]);

        const user_input = input;
        set_input("");

        const chat = await send_chat(user_input);
        set_chat_log((prevState) => [...prevState, {role: "system", message: chat}]);
    }

    const send_chat = async (user_input) => {
        set_loading(true);
        const res = await fetch("http://localhost:8080/chat", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({chat_log: [...chat_log, {role: "user", message: user_input.replace()}]})
        })
        set_loading(false);

        const chat = await res.json()

        return chat.message;

    }

    const handle_enter = (e) => {
        if(e.key === "Enter"){
            on_submit(e);
        }
    }

    useEffect(() => {
        if (overflowDivRef.current) {
            overflowDivRef.current.scrollTop = overflowDivRef.current.scrollHeight;
        }
    }, [chat_log]);

    return (
            <div className = "rounded-3" style = {{width: "600px", height: "600px", boxShadow: "2px 2px 2px 2px"}}>
                <div className="w-100 overflow-x-hidden overflow-y-auto" style = {{height: "93.75%"}} ref={overflowDivRef}>
                    {
                        chat_log.map((value, index) =>
                            <div className="row" key={index}>
                                <div className={value.role === "user" ? "d-flex justify-content-end" : "d-flex justify-content-start"}>
                                    {
                                        value.role === "user" ?
                                            <p className = "text-white p-2 m-1 rounded-3" dangerouslySetInnerHTML={{ __html: value.message }} style = {{backgroundColor : "#092f1b"}} />
                                            :
                                            <p className = "bg-light p-2 rounded-3 m-1" dangerouslySetInnerHTML={{ __html: value.message }} />
                                    }
                                </div>
                            </div>
                        )
                    }
                    {
                        loading && <div className="row bg-light p-2 rounded-3 m-1">
                            <div className = "d-flex align-items-center">
                                <p className = "m-0"> Give me a second to think 🤔 </p>
                                <div className="spinner-grow m-1" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className="d-flex">
                    <input type="text" className="form-control" placeholder="Enter message here" value={input} style = {{borderRadius: "50rem"}} onChange={(e) => set_input(e.target.value)} onKeyUp = {handle_enter}/>
                    <button type="submit" className="btn" style = {{backgroundColor : "#092f1b", color: "white", borderRadius: "50rem"}} onClick={on_submit}>Submit</button>
                </div>
            </div>

    );
}

export default Chat;