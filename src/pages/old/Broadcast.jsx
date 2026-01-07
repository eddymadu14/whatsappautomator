
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { sendBroadcast } from "../services/broadcast.api";
import PageHeader from "../components/PageHeader";

export default function Broadcast() {
  const { whatsapp } = useContext(AppContext);

  const send = async () => {
    if (whatsapp?.status !== "connected") {
      alert("WhatsApp not connected");
      return;
    }
    await sendBroadcast({ message: "Hello" });
    alert("Broadcast sent");
  };

  return (
    <>
      <PageHeader title="Broadcast" />
      <button onClick={send}>Send Broadcast</button>
    </>
  );
}
