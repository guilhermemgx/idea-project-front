import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IdeaForm } from "../components/IdeaForm";
import { Loading } from "../components/Loading";
import { PageHeader } from "../components/PageHeader";
import { StatusMessage } from "../components/StatusMessage";
import { getIdeaById, updateIdea } from "../services/ideaService";
import { Idea, UpdateIdeaInput } from "../types/idea";

export function IdeaEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await getIdeaById(id);
        setIdea(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar a ideia.",
        );
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [id]);

  async function handleSubmit(payload: UpdateIdeaInput) {
    if (!id) return;

    try {
      setSaving(true);
      setError("");
      const updated = await updateIdea(id, payload);
      navigate(`/ideas/${updated.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar a ideia.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <PageHeader
        title={idea ? `Editar ideia ${idea.id}` : "Editar ideia"}
        description="Neste MVP, apenas os campos textuais da ideia podem ser alterados."
      />

      {error ? <StatusMessage type="error">{error}</StatusMessage> : null}
      {loading ? <Loading /> : null}

      {!loading && idea ? (
        <IdeaForm
          mode="edit"
          initialData={idea}
          onSubmit={handleSubmit}
          isSubmitting={saving}
        />
      ) : null}
    </section>
  );
}
