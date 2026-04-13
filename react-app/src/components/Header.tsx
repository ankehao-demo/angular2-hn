import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div id="header">
      <div className="header-content">
        <Link to="/news/1" className="logo">
          <span className="logo-inner">HN</span>
        </Link>
        <nav className="nav">
          <Link to="/news/1">news</Link>
          <Link to="/newest/1">newest</Link>
          <Link to="/show/1">show</Link>
          <Link to="/ask/1">ask</Link>
          <Link to="/jobs/1">jobs</Link>
        </nav>
      </div>
    </div>
  );
}
