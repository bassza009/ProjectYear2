import re
import os

# Directory to process
project_dir = r"c:\Users\Windows\Desktop\67021499\New folder\67021499\ProjectYear2"

# Pattern to match console.log, console.error, console.warn statements
console_pattern = re.compile(r'^\s*console\.(log|error|warn)\([^;]*\);?\s*$', re.MULTILINE)

# Files to process
files_to_process = []
for root, dirs, files in os.walk(project_dir):
    for file in files:
        if file.endswith('.js') and 'node_modules' not in root:
            files_to_process.append(os.path.join(root, file))

# Process each file
modified_count = 0
for filepath in files_to_process:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        # Remove console statements
        modified_content = console_pattern.sub('', original_content)
        
        # Only write if content changed
        if original_content != modified_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(modified_content)
            modified_count += 1
            print(f"✓ Cleaned: {os.path.basename(filepath)}")
    except Exception as e:
        print(f"✗ Error processing {filepath}: {e}")

print(f"\n✅ Total files modified: {modified_count}/{len(files_to_process)}")
