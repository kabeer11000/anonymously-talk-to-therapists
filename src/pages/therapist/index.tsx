import React from "react";
import {db} from "../../../firebaseconfig";
import {useCollectionData} from "react-firebase-hooks/firestore";
import "firebase/firestore"

const App = () => {
    const [conversations, loading]: [conversations: Array<{id: string, ref: any}>] = useCollectionData(db.collection("conversations"));
    if (loading) return <div>Loading...</div>;
    if (conversations?.length === 0) return <div>No Conversations</div>;
    // adding chat component in full screen container
    return (
        <div style={{width: "100%", height: "100%", padding: "2rem", overflow: "hidden"}}>
            <h1 className={"text-2xl"}>All Conversations:</h1>
            <ul>
                {conversations.map((c, i) => <li key={i}><a style={{color: "blue"}} href={`/therapist/${c.id}/`}>user c.id</a></li>)}
            </ul>
        </div>
    );
}

export default App