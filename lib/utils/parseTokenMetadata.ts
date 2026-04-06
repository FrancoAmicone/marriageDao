/**
 * Parse token metadata from a tokenURI string.
 * Handles IPFS URIs, base64 data URIs, and HTTP URLs.
 */
export async function parseTokenMetadata(tokenURI: string): Promise<Record<string, any>> {
  if (tokenURI.startsWith('data:application/json;base64,') || tokenURI.startsWith('data:application/json,')) {
    const base64Data = tokenURI.split(',')[1];
    const jsonString = atob(base64Data);
    return JSON.parse(jsonString);
  }

  const url = tokenURI.startsWith('ipfs://')
    ? tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
    : tokenURI;

  const response = await fetch(url);
  return response.json();
}
