import { createContext } from "react";
import Socket from "ws";

const ws = createContext(new Socket(process.env.WSS_ADDRESS!));

export default ws;
