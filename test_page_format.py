"""Test the page JSON format generation"""

# Simulate the page list
pages = ['index', 'about', 'services', 'contact']

# Generate JSON example
pages_json_example = ',\n  '.join([f'"{page}.html": "complete HTML"' for page in pages])

print("Generated JSON Example:")
print("{")
print("  " + pages_json_example + ",")
print('  "styles.css": "complete CSS",')
print('  "script.js": "complete JavaScript"')
print("}")

print("\n" + "="*50)
print("First key:", pages[0] + ".html")
print("Expected: index.html")
print("Match:", (pages[0] + ".html") == "index.html")
