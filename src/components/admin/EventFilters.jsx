export default function EventFilters({
    search, setSearch,
    statusFilter, setStatusFilter,
    dateFilter, setDateFilter
  }) {
    return (
      <div className="bg-[#1E2A5F] p-4 rounded-2xl border border-white/20 mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search title or location"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-[#272C3E] text-white border border-white/20"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="p-3 rounded-lg bg-[#272C3E] text-white border border-white/20"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="p-3 rounded-lg bg-[#272C3E] text-white border border-white/20"
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="full">Full</option>
        </select>
      </div>
    );
  }
  