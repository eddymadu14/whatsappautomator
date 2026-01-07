
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";

export default function Dashboard() {
  const { whatsapp } = useContext(AppContext);

  return (
    <>
      <PageHeader title="Dashboard" />
      <StatusBadge status={whatsapp?.status} />
    </>
  );
}
