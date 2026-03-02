#!/usr/bin/env python3
from upstash_vector import Index
import os
from dotenv import load_dotenv

load_dotenv()

index = Index(
    url=os.getenv('test_UPSTASH_VECTOR_REST_URL'),
    token=os.getenv('test_UPSTASH_VECTOR_REST_TOKEN')
)

results = index.query(
    data='recent projects AI RAG',
    top_k=3,
    include_metadata=True
)

for r in results:
    print(f"{r.score:.2f}: {r.metadata.get('title', 'N/A')}")
