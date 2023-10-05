import React, {FunctionComponent, useEffect, useState} from "react";
import {Chat, ChatMessage, Message} from "react-chat-module";
import "react-chat-module/dist/index.css";
import {db} from "../../firebaseconfig";
import {useCollectionData} from "react-firebase-hooks/firestore";
import "firebase/firestore"
import {useRouter} from "next/router";

// Conversation is created, and is only retried here;
declare module "react-chat-module" {
    export interface MessageTypeMap {
        test: "test";
    }
}
const loadFile = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if (reader.result === null) return;
            if (typeof reader.result === "string") resolve(reader.result);

            let binary = "";
            const bytes = new Uint8Array(reader.result as ArrayBuffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            resolve(window.btoa(binary));
        };
        reader.onerror = reject;
        reader.onabort = reject;
    });
};

const testComponent: FunctionComponent<{ message: ChatMessage }> = () => {
    return <div>Test</div>;
}

const App = () => {
    const {back} = useRouter();
    const [id, setId] = useState<undefined | string>();
    const [messages]: [messages: Array<ChatMessage>] = useCollectionData(id ? db.collection("conversations").doc(id).collection("messages") : null);
    useEffect(() => {
        setId(localStorage.getItem("user_id"))
    }, [])
    if (!messages) return <div>Loading...</div>;
    const onSend = async (message: Message) => {
        // build new message received from chat component

        // const doc = await db.collection("conversations").doc(localStorage.getItem('user_id')).collection("messages").doc();
        // const messageId = doc.id;
        const messageId = ((messages?.length ?? 0) + 1).toString();
        const newMessage: ChatMessage = {
            messageId: `${messageId}`,
            senderId: 'user:' + localStorage.getItem("user_id"),
            profilePicture: "https://via.placeholder.com/150",
            type: message.type,
            text: message.text,
            createdAt: message.createdAt,
            read: false
        };
        if (message.type === "video" && message.attachment)
            newMessage.video = await loadFile(message.attachment);
        if (message.type === "image" && message.attachment)
            newMessage.photo = await loadFile(message.attachment);
        if (message.type === "audio" && message.attachment)
            newMessage.audio = await loadFile(message.attachment);

        // store user message in messages state and add "server" message
        // to simulate typing
        await db.collection("conversations").doc(localStorage.getItem('user_id')).collection("messages").doc(messageId).set(newMessage);
    };

    // adding chat component in full screen container
    return (
        <div style={{width: "100%", height: "100%", overflow: "hidden"}}>
            <div className={"navbar"} style={{
                padding: "1rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                width: "100%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                display: "flex",
                backgroundColor: "white",
                zIndex: 99999,
                position: "fixed",
                justifyContent: "left"
            }}>
                <button onClick={back} style={{marginRight: "1rem", borderRadius: 999}}><span
                    className="material-symbols-outlined">arrow_back</span></button>
                <div><h4>EQA Chat</h4><small>All conversations are anonymous</small></div>
            </div>
            {!messages.length && <div style={{opacity: 0.8, marginTop: "15rem", padding: "1.5rem", alignItems: "center", textAlign: "center", display: "flex", justifyContent: "center"}}>
                <img style={{width: "7rem", marginRight: "1rem"}} src={"https://cdn-icons-png.flaticon.com/512/2258/2258884.png"}/>
                <h1>No Messages found, Start a conversation</h1>
            </div>}
            <Chat messages={(messages ?? []).map(m => ({
                ...m, createdAt: m.createdAt.toDate()
            })).sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(a.createdAt) - new Date(b.createdAt);
            })} userId={"user:1"} onSend={onSend}/>
        </div>
    );
}

export default App