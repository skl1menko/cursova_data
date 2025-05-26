const BussFilter = ({filters, setFilters, uniqueModels, handleModelChange}) => {
    return (
        <div className="filter-group">
            <select value={filters.model} onChange={handleModelChange}>
                <option value="">Всі моделі</option>
                {uniqueModels.map((model, index) => (
                    <option key={index} value={model}>{model}</option>
                ))}
            </select>
            <input type="number" placeholder="Місткість" value={filters.capacity}
                onChange={(e) => setFilters({ ...filters, capacity: e.target.value })} />
            <input type="number" placeholder="Рік" value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })} />
        </div>
    )
}
export default BussFilter;