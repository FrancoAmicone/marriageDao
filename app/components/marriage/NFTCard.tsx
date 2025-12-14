import { useState } from 'react';

interface NFTCardProps {
    image: string;
    name: string;
    description?: string;
    tokenId: string;
    year?: string;
    customMetadata?: {
        partnerA?: string;
        partnerB?: string;
        marriageDate?: string;
        marriageId?: string;
    };
}

export function NFTCard({ image, name, description, tokenId, year, customMetadata }: NFTCardProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Convert IPFS URL to HTTP gateway if needed
    const resolvedImageUrl = image 
        ? image.replace('ipfs://', 'https://ipfs.io/ipfs/')
        : '';

    console.log('🖼️ NFTCard render:', { 
        name, 
        originalImage: image, 
        resolvedImageUrl, 
        imageError,
        tokenId 
    });

    return (
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100">
            {/* Image Section */}
            <div className="relative aspect-square w-full bg-gray-100">
                {resolvedImageUrl && !imageError ? (
                    <>
                        {/* Loading Skeleton */}
                        {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-black"></div>
                            </div>
                        )}
                        
                        {/* Actual Image */}
                        <img
                            src={resolvedImageUrl}
                            alt={name}
                            className={`object-cover w-full h-full transition-opacity duration-300 ${
                                imageLoading ? 'opacity-0' : 'opacity-100'
                            }`}
                            onLoad={() => {
                                console.log('✅ Image loaded:', resolvedImageUrl);
                                setImageLoading(false);
                            }}
                            onError={(e) => {
                                console.error('❌ Image failed to load:', resolvedImageUrl, e);
                                setImageError(true);
                                setImageLoading(false);
                            }}
                        />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
                        <div className="text-sm text-center">
                            {imageError ? 'Image not available' : 'No image'}
                        </div>
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-base text-black leading-tight flex-1">
                        {name}
                    </h3>
                    {year && (
                        <span className="shrink-0 px-2 py-1 text-xs font-bold text-black bg-gray-100 rounded-full">
                            Y{year}
                        </span>
                    )}
                </div>

                {description && (
                    <p className="text-sm text-gray-600 line-clamp-3" title={description}>
                        {description}
                    </p>
                )}

                {/* Custom Metadata for Marriage NFTs */}
                {customMetadata && (
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                        {customMetadata.marriageDate && (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Date</span>
                                <span className="text-black font-medium">{customMetadata.marriageDate}</span>
                            </div>
                        )}
                        {customMetadata.partnerA && (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Partner A</span>
                                <span className="text-black font-mono">
                                    {customMetadata.partnerA.substring(0, 6)}...{customMetadata.partnerA.substring(38)}
                                </span>
                            </div>
                        )}
                        {customMetadata.partnerB && (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Partner B</span>
                                <span className="text-black font-mono">
                                    {customMetadata.partnerB.substring(0, 6)}...{customMetadata.partnerB.substring(38)}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <div className="text-xs text-gray-400 font-mono pt-2 border-t border-gray-100">
                    Token #{tokenId}
                </div>
            </div>
        </div>
    );
}
