import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loading } from "../components/Loading";
import { PageHeader } from "../components/PageHeader";
import { StatusMessage } from "../components/StatusMessage";
import { deleteIdea, listIdeas } from "../services/ideaService";
import { Idea } from "../types/idea";
import { formatDate } from "../utils/date";

export function IdeaListPage() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadIdeas() {
    try {
      setLoading(true);
      setError("");
      const result = await listIdeas();
      setIdeas(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar ideias.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadIdeas();
  }, []);

  const filteredIdeas = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return ideas;

    return ideas.filter((idea) =>
      [
        String(idea.id),
        idea.author_re,
        idea.what_can_be_improved,
        idea.current_process,
        idea.proposed_improvement,
        idea.expected_benefit,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [ideas, search]);

  async function handleDelete(idea: Idea) {
    const confirmed = window.confirm(
      `Deseja realmente remover a ideia ${idea.id}? Essa ação não pode ser desfeita.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(idea.id);
      await deleteIdea(String(idea.id));
      setIdeas((current) => current.filter((item) => item.id !== idea.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover a ideia.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <PageHeader
        title="Listagem de ideias"
        description="Consulte, detalhe, edite e remova as ideias registradas no programa D+Ideias."
        actions={
          <Link className="button primary" to="/ideas/new">
            Nova ideia
          </Link>
        }
      />

      <div className="card filter-bar">
        <input
          type="search"
          placeholder="Buscar por RE, número da ideia ou conteúdo"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error ? <StatusMessage type="error">{error}</StatusMessage> : null}
      {loading ? <Loading /> : null}

      {!loading && !error ? (
        filteredIdeas.length ? (
          <div className="card table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>RE</th>
                  <th>O que pode ser melhorado</th>
                  <th>Data de registro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredIdeas.map((idea) => (
                  <tr key={idea.id}>
                    <td>Ideia {idea.id}</td>
                    <td>{idea.author_re}</td>
                    <td>
                      <div className="multiline-ellipsis">
                        {idea.what_can_be_improved}
                      </div>
                    </td>
                    <td>{formatDate(idea.registered_at)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="button ghost"
                          onClick={() => navigate(`/ideas/${idea.id}`)}
                        >
                          Detalhar
                        </button>
                        <button
                          type="button"
                          className="button ghost"
                          onClick={() => navigate(`/ideas/${idea.id}/edit`)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="button danger"
                          disabled={deletingId === idea.id}
                          onClick={() => void handleDelete(idea)}
                        >
                          {deletingId === idea.id ? "Removendo..." : "Excluir"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <StatusMessage>Nenhuma ideia encontrada.</StatusMessage>
        )
      ) : null}
    </section>
  );
}
