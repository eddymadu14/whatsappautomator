
import { useEffect, useState } from "react";
import { fetchTemplates } from "../services/templates.api";
import PageHeader from "../components/PageHeader";

export default function Templates() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchTemplates().then(setTemplates);
  }, []);

  return (
    <>
      <PageHeader title="Templates" />
      <ul>
        {templates.map(t => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </>
  );
}
