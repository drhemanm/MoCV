const RealisticTemplateCard = memo<RealisticTemplateCardProps>(({
  template,
  isSelected,
  isCustomizing,
  isHovered,
  isFavorited,
  customization,
  onSelect,
  onPreview,
  onHover,
  onToggleFavorite,
  renderPreview
}) => {
  const handleCardClick = useCallback(() => {
    onSelect(template);
  }, [onSelect, template]);

  const handlePreviewClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview?.(template);
  }, [onPreview, template]);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(template.id);
  }, [onToggleFavorite, template.id]);

  const handleMouseEnter = useCallback(() => {
    onHover(template.id);
  }, [onHover, template.id]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  return (
    <div 
      className={`
        group relative bg-white border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
        hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 hover:border-gray-300
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
        ${isSelected ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg transform -translate-y-1' : 'border-gray-200'}
      `}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="gridcell"
      tabIndex={0}
      aria-label={`${template.name} template - ${template.description}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Enhanced Template Preview */}
      <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
        <div className="w-full h-full transform transition-transform duration-300 group-hover:scale-105">
          {renderPreview(template)}
        </div>
        
        {/* Enhanced Hover Overlay */}
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-3">
            {onPreview && (
              <button 
                onClick={handlePreviewClick}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={`Preview ${template.name} template`}
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            )}
            <button 
              onClick={handleCardClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={`Select ${template.name} template`}
            >
              <Download className="w-4 h-4" />
              <span>Use Template</span>
            </button>
          </div>
        </div>

        {/* Enhanced Badges */}
        <div className="absolute top-3 left-3 flex space-x-2">
          {template.isPopular && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Popular</span>
            </span>
          )}
          {template.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              New
            </span>
          )}
          {template.atsScore && template.atsScore >= 95 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              ATS+
            </span>
          )}
        </div>

        {/* Enhanced Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            isFavorited
              ? 'bg-red-500 text-white shadow-md focus:ring-red-500'
              : 'bg-white/80 text-gray-700 hover:bg-white shadow-sm focus:ring-gray-500'
          }`}
          aria-label={isFavorited ? `Remove ${template.name} from favorites` : `Add ${template.name} to favorites`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFavorited ? 'fill-current scale-110' : ''}`} />
        </button>

        {/* Layout Type Indicator - FIXED */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">
            {template.layoutType?.replace('-', ' ') || 'template'}
          </span>
        </div>
      </div>

      {/* Enhanced Template Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {template.name}
              </h3>
              {isCustomizing && (
                <span className="text-blue-600 font-medium flex items-center gap-1" aria-label="Currently customizing">
                  <Palette className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {template.description}
            </p>
          </div>
        </div>

        {/* Enhanced Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1" title="Setup time">
              <Clock className="w-3 h-3" />
              <span>{template.estimatedTime}</span>
            </span>
            {template.atsScore && (
              <span className="flex items-center space-x-1" title="ATS compatibility score">
                <TrendingUp className="w-3 h-3" />
                <span>{template.atsScore}%</span>
              </span>
            )}
            {template.successRate && (
              <span className="flex items-center space-x-1" title="Success rate">
                <BarChart3 className="w-3 h-3" />
                <span>{template.successRate}%</span>
              </span>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full font-medium ${
            template.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
            template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {template.difficulty}
          </span>
        </div>

        {/* Enhanced Features */}
        <div className="flex flex-wrap gap-2 mb-3">
          {template.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium hover:bg-gray-200 transition-colors"
              title={feature}
            >
              {feature}
            </span>
          ))}
          {template.features.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1" title={`${template.features.length - 3} more features`}>
              +{template.features.length - 3} more
            </span>
          )}
        </div>

        {/* Enhanced Industry Fit */}
        {template.industryFit && template.industryFit.length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-500 mb-2 font-medium">Perfect for:</p>
            <div className="flex flex-wrap gap-1">
              {template.industryFit.slice(0, 2).map((industry, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium hover:bg-blue-100 transition-colors"
                >
                  {industry}
                </span>
              ))}
              {template.industryFit.length > 2 && (
                <span className="text-xs text-gray-500 px-2 py-1" title={template.industryFit.slice(2).join(', ')}>
                  +{template.industryFit.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sample Data Preview */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1 font-medium">Sample professional:</p>
          <div className="text-xs text-gray-600">
            <span className="font-medium">{template.sampleData?.name || 'Professional Name'}</span>
            <span className="mx-1">•</span>
            <span>{template.sampleData?.title || 'Job Title'}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

RealisticTemplateCard.displayName = 'RealisticTemplateCard';

export default TemplateGallery;

export { 
  enhancedTemplates, 
  colorSchemes, 
  templateUtils,
  type EnhancedCVTemplate,
  type TemplateCustomization,
  type TemplateGalleryProps 
};
