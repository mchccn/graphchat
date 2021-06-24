import { createContext } from "react";
import Socket from "ws";

const socket = createContext(new Socket(process.env.NEXT_PUBLIC_WSS_ADDRESS!));

export default socket;
