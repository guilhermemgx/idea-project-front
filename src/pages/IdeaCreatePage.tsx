import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IdeaForm } from "../components/IdeaForm";
import { PageHeader } from "../components/PageHeader";
import { StatusMessage } from "../components/StatusMessage";
import { createIdea } from "../services/ideaService";
import { CreateIdeaInput } from "../types/idea";

export function IdeaCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(payload: CreateIdeaInput) {
    try {
      setSaving(true);
      setError("");
      const created = await createIdea(payload);
      navigate(`/ideas/${created.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao cadastrar a ideia.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <PageHeader
        title="Nova ideia"
        description="Cadastre uma nova ideia com os mesmos campos previstos na ficha atual do processo manual."
      />

      {error ? <StatusMessage type="error">{error}</StatusMessage> : null}

      <IdeaForm mode="create" onSubmit={handleSubmit} isSubmitting={saving} />
    </section>
  );
}
