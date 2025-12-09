#!/usr/bin/env python3
"""Test AI generation to see actual output"""

from ai_generator import generate_website

try:
    print("Testing AI generation...")
    result = generate_website("modern coffee shop website", {})
    
    print("\n=== GENERATED FILES ===")
    for filename, content in result.items():
        print(f"\n{filename}:")
        print(f"  Length: {len(content)} characters")
        if filename.endswith('.html'):
            # Check if it has basic HTML structure
            has_doctype = '<!DOCTYPE' in content
            has_html = '<html' in content
            has_head = '<head>' in content
            has_body = '<body>' in content
            print(f"  Has DOCTYPE: {has_doctype}")
            print(f"  Has <html>: {has_html}")
            print(f"  Has <head>: {has_head}")
            print(f"  Has <body>: {has_body}")
            print(f"  First 200 chars: {content[:200]}")
        elif filename.endswith('.css'):
            print(f"  First 200 chars: {content[:200]}")
        elif filename.endswith('.js'):
            print(f"  First 200 chars: {content[:200]}")
    
    print("\n=== TEST PASSED ===")
    
except Exception as e:
    print(f"\n=== ERROR ===")
    print(f"Error: {str(e)}")
    import traceback
    traceback.print_exc()
