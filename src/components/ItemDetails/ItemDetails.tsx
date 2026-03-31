import { useParams } from 'react-router-dom';

export function ItemDetails() {
  const { id } = useParams<{ id: string }>();

  return (
    <div style={{ padding: '60px 20px 20px' }}>
      <p>Item Details - ID: {id}</p>
      <p>This is a placeholder component. Full implementation coming in a future session.</p>
    </div>
  );
}
