#!/usr/bin/env python3
"""
Test RAG functionality after documents have been processed
"""

import asyncio
import httpx

async def test_rag_pipeline():
    """Test the RAG pipeline with various queries"""
    
    client = httpx.AsyncClient(timeout=30.0)
    base_url = "http://localhost:7272"
    
    try:
        print("🧪 Testing RAG Pipeline")
        print("=" * 50)
        
        # Test search functionality
        search_queries = [
            "What are the key anti-money laundering requirements?",
            "BSP circular requirements",
            "Data Privacy Act provisions",
            "banking regulations Philippines"
        ]
        
        for query in search_queries:
            print(f"\n🔍 Query: '{query}'")
            
            try:
                search_data = {
                    "query": query,
                    "search_settings": {
                        "limit": 3,
                        "use_hybrid_search": True
                    }
                }
                
                response = await client.post(
                    f"{base_url}/v3/chunks/search",
                    json=search_data
                )
                
                if response.status_code == 200:
                    results = response.json()
                    chunks = results.get('results', [])
                    print(f"  📝 Found {len(chunks)} relevant chunks")
                    
                    for i, chunk in enumerate(chunks[:2], 1):
                        metadata = chunk.get('metadata', {})
                        filename = metadata.get('filename', 'Unknown file')
                        score = chunk.get('score', 0)
                        text_preview = chunk.get('text', '')[:200] + "..."
                        print(f"    {i}. {filename} (Score: {score:.3f})")
                        print(f"       {text_preview}")
                        print()
                else:
                    print(f"  ❌ Search failed: {response.status_code}")
                    
            except Exception as e:
                print(f"  ❌ Query error: {e}")
            
            await asyncio.sleep(1)
        
        # Test document listing
        print(f"\n📚 Listing ingested documents:")
        try:
            response = await client.get(f"{base_url}/v3/documents?limit=5")
            if response.status_code == 200:
                docs_data = response.json()
                documents = docs_data.get('results', [])
                print(f"  📄 Found {len(documents)} documents")
                
                for doc in documents:
                    metadata = doc.get('metadata', {})
                    filename = metadata.get('filename', doc.get('title', 'Unknown'))
                    doc_id = doc.get('id', 'unknown')
                    print(f"    - {filename} (ID: {doc_id})")
            else:
                print(f"  ❌ Document listing failed: {response.status_code}")
        except Exception as e:
            print(f"  ❌ Document listing error: {e}")
    
    finally:
        await client.aclose()

async def main():
    print("🏛️  SiLab Compliance RAG Testing")
    await test_rag_pipeline()
    
    print(f"\n✨ Testing complete!")
    print(f"💡 If documents are found, your RAG pipeline is working!")
    print(f"   You can now use the FastAPI endpoints for RAG functionality.")

if __name__ == "__main__":
    asyncio.run(main())