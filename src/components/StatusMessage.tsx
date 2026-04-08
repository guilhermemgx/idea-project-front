interface StatusMessageProps {
  type?: 'error' | 'success' | 'info';
  children: string;
}

export function StatusMessage({ type = 'info', children }: StatusMessageProps) {
  return <div className={`status-message ${type}`}>{children}</div>;
}
