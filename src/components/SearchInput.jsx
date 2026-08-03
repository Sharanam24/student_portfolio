// Search input with a search icon on the left, matching reference design

export default function SearchInput({ value, onChange }) {
  return (
    <div className="search-wrapper">
      <svg className="search-icon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.5 4.5 0 1 0-8.997.002A4.5 4.5 0 0 0 11.5 7Z"/>
      </svg>
      <input
        type="text"
        className="search-input"
        aria-label="Search repositories"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search repositories by name..."
      />
    </div>
  );
}
