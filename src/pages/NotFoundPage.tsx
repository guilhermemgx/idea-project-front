import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="card not-found">
      <h1>Página não encontrada</h1>
      <p>A rota informada não existe neste frontend.</p>
      <Link className="button primary" to="/ideas">
        Voltar para listagem
      </Link>
    </div>
  );
}
