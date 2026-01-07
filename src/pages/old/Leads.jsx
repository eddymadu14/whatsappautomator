
import { useEffect, useState } from "react";
import { fetchLeads } from "../services/leads.api";
import LeadTable from "../components/LeadTable";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

export default function Leads() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads().then(setLeads);
  }, []);

  return (
    <>
      <PageHeader title="Leads" />
      {leads.length ? <LeadTable leads={leads} /> : <EmptyState />}
    </>
  );
}


