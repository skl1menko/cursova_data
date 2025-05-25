const DriverFilter = ({filters, setFilters}) => {
    return (
        <div className="filter-group">
                <input type="text" placeholder="Ім'я" value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
                <input type="number" placeholder="Досвід" value={filters.experience}
                    onChange={(e) => setFilters({ ...filters, experience: e.target.value })} />
                <input type="text" placeholder="Ліцензія" value={filters.license}
                    onChange={(e) => setFilters({ ...filters, license: e.target.value })} />
            </div>
    )
}

export default DriverFilter;