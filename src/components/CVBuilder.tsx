interface CVBuilderProps {
  selectedTemplate: any;
  targetMarket: string;
  onChangeTemplate: () => void;
}

const CVBuilder: React.FC<CVBuilderProps> = ({ selectedTemplate, targetMarket, onChangeTemplate }) => {
  return (
    <button
      onClick={onChangeTemplate}
      className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
    >
      <RefreshCw className="h-4 w-4" />
      Change Template
    </button>
  );
};

export default CVBuilder;