import React from "react";
import {Chat, ChatMessage, Message} from "react-chat-module";
import "react-chat-module/dist/index.css";
import {db} from "../../../firebaseconfig";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {useRouter} from "next/router";
import "firebase/firestore"
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

const App = () => {
    const {query, back} = useRouter();
    const [messages]: [messages: Array<ChatMessage>] = useCollectionData(db.collection("conversations").doc(query.id?.toString()).collection("messages").orderBy("messageId", "asc"));
    if (!messages) return <div>Loading...</div>;
    const onSend = async (message: Message) => {
        // build new message received from chat component
        // const doc = await db.collection("conversations").doc(localStorage.getItem('user_id')).collection("messages").doc();
        const messageId = ((messages?.length ?? 0) + 1).toString();
        const newMessage: ChatMessage = {
            messageId: `${messageId}`,
            senderId: "therapist:" + localStorage.getItem("therapist_id"),
            profilePicture: "https://cdn.glitch.global/6a4b49bc-76eb-47e2-b7c9-e3b36ed788de/Logo.png?v=1655371433539",
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
                ...m, createdAt: m.createdAt?.toDate()
            })).sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(a.createdAt) - new Date(b.createdAt);
            })} userId={"therapist:1"} onSend={onSend}/>
        </div>
    );
}

export default App