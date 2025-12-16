import shutil
import os

source = "HARITAGE VIEW"
destination = "frontend/public/heritage-view"

if os.path.exists(destination):
    shutil.rmtree(destination)

# Ignore .git and other junk
def ignore_patterns(path, names):
    return [n for n in names if n in ['.git', 'node_modules', 'downloads']]

shutil.copytree(source, destination, ignore=ignore_patterns)
print(f"Copied {source} to {destination}")
