"""
Test script for new AI generator enhancements
Tests: 1) Prompt enhancement, 2) Dynamic page count, 3) Consistent navbar
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from ai_generator import enhance_user_prompt

# Test 1: Prompt Enhancement
print("=" * 60)
print("TEST 1: PROMPT ENHANCEMENT")
print("=" * 60)

simple_prompt = "I need a website for my gym"
print(f"\n📝 Original prompt: '{simple_prompt}'")
print("\n🔍 Enhancing with LLM...")

enhanced = enhance_user_prompt(simple_prompt)

print(f"\n✅ Enhanced Data:")
print(f"   Business Type: {enhanced.get('business_type')}")
print(f"   Target Audience: {enhanced.get('target_audience')}")
print(f"   Visual Style: {enhanced.get('visual_style')}")
print(f"   Color Mood: {enhanced.get('color_mood')}")
print(f"   Key Features: {enhanced.get('key_features')}")
print(f"   Pages: {enhanced.get('pages')}")
print(f"\n📄 Enhanced Description:")
print(f"   {enhanced.get('enhanced_description')[:300]}...")

print("\n" + "=" * 60)
print("TEST 2: DYNAMIC PAGE COUNT")
print("=" * 60)

test_cases = [
    "Simple portfolio website",
    "Full-service law firm with multiple practice areas",
    "E-commerce store for handmade jewelry"
]

for test in test_cases:
    result = enhance_user_prompt(test)
    print(f"\n📝 '{test}'")
    print(f"   → {len(result['pages'])} pages: {', '.join(result['pages'])}")

print("\n" + "=" * 60)
print("✅ All tests completed!")
print("=" * 60)
print("\nNext steps:")
print("1. Test full website generation with backend server")
print("2. Verify navbar consistency across pages")
print("3. Check image sources are correct (Picsum Photos)")
