from upstash_vector import Index
import os
from dotenv import load_dotenv

load_dotenv()

index = Index(
    url=os.getenv('UPSTASH_VECTOR_REST_URL'),
    token=os.getenv('UPSTASH_VECTOR_REST_TOKEN')
)

print("\n🔍 Testing Vector Database Query for 'recent projects'")
print("=" * 60)

results = index.query(
    vector=None,
    data='What projects have you worked on recently?',
    top_k=3,
    include_metadata=True
)

for i, result in enumerate(results, 1):
    print(f"\n{i}. Score: {result.score:.4f}")
    print(f"   Section: {result.metadata.get('section', 'Unknown')}")
    print(f"   Text: {result.metadata.get('text', '')[:300]}...")
