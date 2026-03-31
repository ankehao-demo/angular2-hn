import React from 'react';
import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <a
        href="https://github.com/AntJanus/angular2-hn"
        target="_blank"
        rel="noopener noreferrer"
      >
        Built with React + TypeScript
      </a>
    </footer>
  );
};

export default Footer;
