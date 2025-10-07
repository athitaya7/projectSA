import './PageHeader.css';

function PageHeader({ title, icon }) {
  return (
    <div className="page-header">
      <h1>
        {icon && <span className="header-icon">{icon}</span>}
        {title}
      </h1>
    </div>
  );
}

export default PageHeader;