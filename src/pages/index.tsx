import {Inter} from 'next/font/google'
import {useEffect} from "react";
import {v4} from "uuid";
import {db} from "../../firebaseconfig";
import {useRouter} from "next/router";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const router = useRouter();
    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
        >
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <div
                    className="fixed top left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                    <a
                        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                        href="https://ekqadamaur.kabeers.network"
                        target="_blank"
                        rel="noopener noreferrer">
                        <img
                            src="https://cdn.glitch.global/6a4b49bc-76eb-47e2-b7c9-e3b36ed788de/Logo.png?v=1655371433539"
                            alt="Vercel Logo"
                            className="dark:invert"
                            style={{borderRadius: 999}}
                            width={100}
                            height={24}
                        />
                    </a>
                </div>
            </div>

            <h1 className={"text-2xl"}>Free Anonymous chat by &nbsp;<strong>EK Qadam Aur</strong></h1>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <button
                    onClick={async () => {
                        if (!localStorage.getItem("user_id")) localStorage.setItem("user_id", v4());
                        db.collection("conversations").doc(localStorage.getItem('user_id')).set({id: localStorage.getItem('user_id')}).then(() => {
                            router.push("/chat");
                        });
                    }}
                    className={"mr-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"}>Connect
                    with a therapist
                </button>
                <a href={"https://ekqadamaur.kabeers.network"}
                    className={"bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"}>About
                    EQA
                </a>
            </div>
        </main>
    )
}
