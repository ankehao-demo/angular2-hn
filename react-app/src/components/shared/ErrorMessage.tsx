interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message = 'An error occurred.' }: ErrorMessageProps) {
  return (
    <div className="error-section">
      <p>{message}</p>
    </div>
  );
}
