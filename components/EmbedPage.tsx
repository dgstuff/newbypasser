import React from 'react';
import { useParams } from 'react-router-dom';
import { useMappings } from '../contexts/MappingsContext';

const NotFound: React.FC<{ slug?: string }> = ({ slug }) => (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white flex-col">
        <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
        <p className="text-lg">No mapping found for path: <code className="bg-gray-700 p-1 rounded">/{slug}</code></p>
        <a href="#/admin" className="mt-6 text-blue-400 hover:underline">Go to Admin Page</a>
    </div>
);

const EmbedPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { mappings } = useMappings();
  
  const mapping = mappings.find(m => m.path === slug);

  if (!mapping) {
    return <NotFound slug={slug} />;
  }

  return (
    <iframe
      src={mapping.targetUrl}
      title={`Embedded content for ${slug}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        zIndex: 9999,
      }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
  );
};

export default EmbedPage;

