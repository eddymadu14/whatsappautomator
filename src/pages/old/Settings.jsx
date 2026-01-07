
import { useState } from "react";
import PageHeader from "../components/PageHeader";

export default function Settings() {
  const [enabled, setEnabled] = useState(true);

  return (
    <>
      <PageHeader title="Settings" />
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
        />
        Auto Reply Enabled
      </label>
    </>
  );
}

