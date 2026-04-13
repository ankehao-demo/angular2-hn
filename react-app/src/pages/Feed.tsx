interface FeedProps {
  feedType: string;
}

export default function Feed({ feedType }: FeedProps) {
  return (
    <div className="feed">
      <h2>{feedType} Feed</h2>
      <p>Feed placeholder for "{feedType}"</p>
    </div>
  );
}
