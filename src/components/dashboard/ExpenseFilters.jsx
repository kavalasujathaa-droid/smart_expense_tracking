import React from 'react';
import { Search, Filter, Calendar, ArrowUpDown, X, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../../lib/expenseService';

/**
 * Redesigned Filter and Search Controls
 * Scaled typography (~15.5px inputs), dark glass surfaces, and responsive flexbox.
 */
export default function ExpenseFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
  onResetFilters,
  categories = null,
}) {
  const isFiltered = searchQuery || selectedCategory !== 'ALL' || dateFilter !== 'ALL' || sortBy !== 'NEWEST';
  const categoryOptions = categories && categories.length > 0
    ? categories
    : CATEGORIES.map((c) => c.name);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.035)',
        border: '1px solid var(--border-glass)',
        borderRadius: '16px',
        backdropFilter: 'var(--blur-glass-md)',
        WebkitBackdropFilter: 'var(--blur-glass-md)',
        boxShadow: 'var(--shadow-glass-sm)',
        marginBottom: '20px',
      }}
    >
      {/* Search Input */}
      <div
        style={{
          position: 'relative',
          flex: '1 1 260px',
          minWidth: '220px',
        }}
      >
        <Search
          size={16}
          color="#9e9ea7"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Search expenses by title or note..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '11px 38px 11px 40px',
            color: '#fff',
            fontSize: '15.5px',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-green)';
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--focus-ring)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-glass)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#9e9ea7',
              cursor: 'pointer',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown Filters Group */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', flex: '2 1 auto' }}>
        {/* Category Filter */}
        <div style={{ position: 'relative', flex: '1 1 140px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by Category"
            style={{
              width: '100%',
              background: 'rgba(12, 14, 22, 0.88)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '11px 14px',
              color: '#ededed',
              fontSize: '15px',
              outline: 'none',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-green)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--focus-ring)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-glass)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="ALL">All Categories</option>
            {categoryOptions.map((catName) => (
              <option key={catName} value={catName} style={{ background: '#050709', color: '#fff' }}>
                {catName}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div style={{ position: 'relative', flex: '1 1 130px' }}>
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            aria-label="Filter by Date Range"
            style={{
              width: '100%',
              background: 'rgba(10, 16, 22, 0.9)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '11px 14px',
              color: '#ededed',
              fontSize: '15px',
              outline: 'none',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-green)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--focus-ring)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-glass)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="ALL">All Time</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="PAST_30_DAYS">Past 30 Days</option>
            <option value="PAST_7_DAYS">Past 7 Days</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div style={{ position: 'relative', flex: '1 1 150px' }}>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort Order"
            style={{
              width: '100%',
              background: 'rgba(10, 16, 22, 0.9)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '11px 14px',
              color: '#ededed',
              fontSize: '15px',
              outline: 'none',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-green)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--focus-ring)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-glass)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="NEWEST">Date: Newest First</option>
            <option value="OLDEST">Date: Oldest First</option>
            <option value="AMOUNT_HIGH">Amount: High to Low</option>
            <option value="AMOUNT_LOW">Amount: Low to High</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: '#dedede',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
              e.currentTarget.style.borderColor = 'var(--border-glass-light)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'var(--border-glass)';
              e.currentTarget.style.color = '#dedede';
            }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
