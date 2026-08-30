import { useState, useMemo } from 'react';
import { GovHeader } from '../components/GovHeader';
import { useTranslation } from '../i18n/useTranslation';
import {
  DEMO_ALLIED_PRODUCTS,
  ALLIED_CATEGORIES,
  QUICK_FILTERS,
  filterProducts,
  getPopularProducts,
  type AlliedProduct
} from '../data/alliedDemoData';

// Kopergaon location context
const LOCATION = {
  name: 'Kopergaon',
  district: 'Ahmednagar',
  state: 'Maharashtra'
};

export function AlliedBazarPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter products based on search and active filter
  const filteredProducts = useMemo(() => {
    return filterProducts(DEMO_ALLIED_PRODUCTS, searchQuery, activeFilter);
  }, [searchQuery, activeFilter]);

  // Get popular products for the region
  const popularProducts = useMemo(() => {
    return getPopularProducts(DEMO_ALLIED_PRODUCTS);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up':
        return { icon: '↑', color: 'text-green-600', bg: 'bg-green-50', label: t('mandi.latestUpdates') };
      case 'down':
        return { icon: '↓', color: 'text-red-600', bg: 'bg-red-50', label: t('error.dataUnavailable') };
      case 'same':
        return { icon: '→', color: 'text-gray-600', bg: 'bg-gray-50', label: 'Stable' };
      default:
        return null;
    }
  };

  const formatChange = (change?: number) => {
    if (change === undefined || change === null || change === 0) return null;
    const sign = change > 0 ? '+' : '';
    return `${sign}₹${Math.abs(change).toLocaleString()}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      milk: 'from-blue-600 to-blue-800',
      egg: 'from-amber-600 to-amber-800',
      poultry: 'from-orange-600 to-orange-800',
      meat: 'from-red-600 to-red-800',
      fish: 'from-cyan-600 to-cyan-800',
      beekeeping: 'from-yellow-600 to-yellow-800'
    };
    return colors[category] || 'from-green-600 to-green-800';
  };

  const ProductCard = ({ product }: { product: AlliedProduct }) => (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200
                hover:shadow-md transition-shadow"
    >
      {/* Card Image Header */}
      <div 
        className={`h-[120px] bg-gradient-to-br ${getCategoryColor(product.category)} 
                  flex items-center justify-center relative overflow-hidden`}
      >
        {/* Icon/Emoji as visual */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <span className="text-[64px] opacity-50">{product.icon}</span>
        </div>
        
        {/* Content on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-white font-bold text-[18px] mb-1 drop-shadow-lg">
                {product.name}
              </h3>
              <div className="text-white/90 text-[12px] drop-shadow flex items-center gap-2">
                <span>{ALLIED_CATEGORIES[product.category].icon}</span>
                <span>{ALLIED_CATEGORIES[product.category].name}</span>
              </div>
            </div>
            <div className="text-white/80 text-[11px] bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
              {formatDate(product.lastUpdated)}
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Experimental Data Warning */}
        <div className="mb-2 px-2 py-1 bg-amber-50 border border-amber-200 rounded text-[10px] text-amber-800 text-center">
          ⚠️ {t('allied.experimental')}
        </div>

        {/* Main Price with Trend */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[11px] text-gray-500 uppercase tracking-wide">
              {t('mandi.todayRates')}
            </div>
            {/* Trend Indicator */}
            {getTrendIcon(product.trend) && (
              <div 
                className={`flex items-center gap-1 px-2 py-1 rounded-full ${getTrendIcon(product.trend)!.bg}`}
              >
                <span className={`text-[16px] font-bold ${getTrendIcon(product.trend)!.color}`}>
                  {getTrendIcon(product.trend)!.icon}
                </span>
                <span className={`text-[11px] font-semibold ${getTrendIcon(product.trend)!.color}`}>
                  {getTrendIcon(product.trend)!.label}
                </span>
                {formatChange(product.change) && (
                  <span className={`text-[10px] font-medium ${getTrendIcon(product.trend)!.color}`}>
                    ({formatChange(product.change)})
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#0b5e2c] leading-none">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-[14px] text-gray-600">{t('mandi.perQuintal')}</span>
          </div>
        </div>

        {/* Price Range (if available) */}
        {product.minPrice && product.maxPrice && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-red-50 rounded-lg px-3 py-2 border border-red-100">
              <div className="text-[10px] text-gray-600 uppercase tracking-wide mb-1">
                {t('mandi.minPrice')}
              </div>
              <div className="text-[18px] font-bold text-red-700">
                ₹{product.minPrice.toLocaleString()}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg px-3 py-2 border border-green-100">
              <div className="text-[10px] text-gray-600 uppercase tracking-wide mb-1">
                {t('mandi.maxPrice')}
              </div>
              <div className="text-[18px] font-bold text-green-700">
                ₹{product.maxPrice.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-[12px] text-gray-600 mb-3 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Metadata Footer */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t">
          <div>
            📍 {product.region}
          </div>
          <div className="flex items-center gap-1">
            {product.popularIn.includes('Kopargaon') && (
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-medium">
                {t('allied.popular')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <GovHeader />
      
      <main className="flex-1 content-with-nav">
        {/* Header Section */}
        <div className="bg-white border-b-4 border-[#0b5e2c]">
          <div className="max-w-[420px] mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-[22px] font-bold text-[#0b5e2c]">
                🏪 {t('allied.title')}
              </h1>
              <div className="text-right">
                <div className="text-[13px] font-semibold text-gray-900">{LOCATION.name}</div>
                <div className="text-[11px] text-gray-600">{LOCATION.district}, {LOCATION.state}</div>
              </div>
            </div>
            <div className="text-[13px] text-gray-600">
              {t('allied.searchPlaceholder')}
            </div>
            {/* Experimental Notice */}
            <div className="mt-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-[16px]">⚠️</span>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  <strong>{t('allied.experimental')}:</strong> {t('allied.experimentalText')}{' '}
                  <a 
                    href="https://enam.gov.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline font-semibold hover:text-amber-950"
                  >
                    e-NAM
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-[420px] mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="bg-white rounded-lg p-3 mb-4 shadow-sm border border-gray-200">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('allied.searchPlaceholder')}
                  className="w-full px-4 py-3 pr-24 border-2 border-gray-200 rounded-lg 
                            focus:outline-none focus:border-[#0b5e2c] text-[14px]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-20 top-1/2 -translate-y-1/2 
                              text-gray-400 hover:text-gray-600 text-[20px]"
                  >
                    ×
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 
                            px-4 py-2 bg-[#0b5e2c] text-white rounded-lg text-[13px] font-semibold
                            hover:bg-[#094d24] transition-colors"
                >
                  {t('mandi.search')}
                </button>
              </div>
            </form>

            {/* Quick Filter Buttons */}
            <div className="mb-2">
              <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-2">
                {t('allied.quickFilters')}
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-3 py-1.5 text-[12px] rounded-full transition-colors
                      ${activeFilter === filter.id
                        ? 'bg-[#0b5e2c] text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                  >
                    {filter.icon} {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Popular Around Kopargaon Section */}
          {!searchQuery && activeFilter === 'all' && popularProducts.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-[16px] font-bold text-gray-900">
                  🌾 {t('allied.popular')}
                </h2>
              </div>
              <div className="text-[12px] text-gray-600 mb-3">
                {t('allied.commonActivities')} {LOCATION.name}
              </div>
              <div className="space-y-4">
                {popularProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Divider */}
              <div className="my-6 border-t-2 border-gray-200"></div>
            </div>
          )}

          {/* All Products Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[13px] text-gray-600 font-medium">
                {searchQuery 
                  ? `${t('mandi.searching')}: "${searchQuery}"` 
                  : activeFilter !== 'all'
                    ? `${t('allied.filterLabel')}: ${QUICK_FILTERS.find(f => f.id === activeFilter)?.label}`
                    : t('allied.allProducts')}
              </div>
              <div className="text-[11px] text-gray-500">
                {filteredProducts.length} {filteredProducts.length === 1 ? t('allied.productCount') : `${t('allied.productCount')}s`}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="text-gray-400 text-[48px] mb-3">🔍</div>
                <p className="text-gray-600 text-[14px] mb-2">
                  {t('mandi.noResults')}
                </p>
                <p className="text-gray-500 text-[12px] mb-4">
                  {searchQuery 
                    ? t('allied.tryDifferentSearch')
                    : t('allied.noProducts')}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="px-4 py-2 bg-[#0b5e2c] text-white rounded-lg text-[13px] font-semibold"
                >
                  {t('allied.clearFilters')}
                </button>
              </div>
            )}
          </div>

          {/* Categories Overview (when not searching) */}
          {!searchQuery && activeFilter === 'all' && (
            <div className="mt-6 mb-4">
              <h3 className="text-[14px] font-bold text-gray-900 mb-3">
                📋 {t('allied.categories')}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(ALLIED_CATEGORIES)
                  .sort((a, b) => a[1].priority - b[1].priority)
                  .map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setActiveFilter(key)}
                      className="bg-white rounded-lg p-3 border border-gray-200 
                                hover:border-[#0b5e2c] hover:shadow-md transition-all text-left"
                    >
                      <div className="text-[32px] mb-1">{category.icon}</div>
                      <div className="text-[13px] font-semibold text-gray-900 mb-1">
                        {category.name}
                      </div>
                      <div className="text-[10px] text-gray-600 leading-relaxed">
                        {category.description}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="text-center text-[11px] text-gray-500 py-6 border-t mt-6">
            <div className="mb-2">⚠️ {t('allied.experimentalText')}</div>
            <div className="mb-2">
              {t('market.dataSource')}{' '}
              <a 
                href="https://enam.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#0b5e2c] underline font-semibold hover:text-[#094d24]"
              >
                e-NAM
              </a>
            </div>
            <div className="mt-3 text-[10px]">
              {t('allied.experimental')} • {t('allied.experimentalText')}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
