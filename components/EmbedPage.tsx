import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMappings } from '../contexts/MappingsContext';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

const EmbedPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { mappings } = useMappings();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    setHtmlContent(null);

    const mapping = mappings.find(m => m.path === slug);

    if (!mapping) {
      setError(`No mapping found for path: /${slug}`);
      setLoading(false);
      return;
    }

    // Using a CORS proxy to simulate server-side fetch
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(mapping.targetUrl)}`;

    const fetchContent = async () => {
      try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        setHtmlContent(text);
      } catch (err: any) {
        setError(`Error fetching from ${mapping.targetUrl}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, mappings]);

  if (loading) {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-white mb-4">Loading Content...</h1>
            <LoadingSpinner />
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg shadow-lg" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
        </div>
    );
  }

  if (htmlContent) {
    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    );
  }
  
  return null;
};

export default EmbedPage;
