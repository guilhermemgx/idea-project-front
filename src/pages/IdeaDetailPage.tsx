import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components/Loading';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { deleteIdea, getIdeaById } from '../services/ideaService';
import { Idea } from '../types/idea';
import { formatDate } from '../utils/date';

export function IdeaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const run = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await getIdeaById(id);
        setIdea(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar a ideia.');
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [id]);

  async function handleDelete() {
    if (!idea) return;

    const confirmed = window.confirm(
      `Deseja remover a ideia ${idea.id}? Essa ação não pode ser desfeita.`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteIdea(String(idea.id));
      navigate('/ideas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover a ideia.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section>
      <PageHeader
        title={idea ? `Detalhes da ideia ${idea.id}` : 'Detalhes da ideia'}
        description="Visualize todos os dados cadastrados para a ideia selecionada."
        actions={
          idea ? (
            <div className="page-actions-inline">
              <Link className="button ghost" to={`/ideas/${idea.id}/edit`}>
                Editar
              </Link>
              <button
                type="button"
                className="button danger"
                disabled={deleting}
                onClick={() => void handleDelete()}
              >
                {deleting ? 'Removendo...' : 'Excluir'}
              </button>
            </div>
          ) : null
        }
      />

      {error ? <StatusMessage type="error">{error}</StatusMessage> : null}
      {loading ? <Loading /> : null}

      {!loading && idea ? (
        <div className="card detail-grid">
          <div className="detail-row two-columns">
            <div>
              <span className="detail-label">Identificador</span>
              <strong>Ideia {idea.id}</strong>
            </div>
            <div>
              <span className="detail-label">RE do autor</span>
              <strong>{idea.author_re}</strong>
            </div>
          </div>

          <div className="detail-row two-columns">
            <div>
              <span className="detail-label">Data de registro</span>
              <strong>{formatDate(idea.registered_at)}</strong>
            </div>
          </div>

          <div className="detail-row">
            <span className="detail-label">O que pode ser melhorado</span>
            <p>{idea.what_can_be_improved}</p>
          </div>

          <div className="detail-row">
            <span className="detail-label">Como é feito hoje</span>
            <p>{idea.current_process}</p>
          </div>

          <div className="detail-row">
            <span className="detail-label">Como pode ser melhorado</span>
            <p>{idea.proposed_improvement}</p>
          </div>

          <div className="detail-row">
            <span className="detail-label">Qual é o benefício</span>
            <p>{idea.expected_benefit}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
