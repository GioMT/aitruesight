import os
import re

# Resolve base directories dynamically using the script's actual file path
base_dir = os.path.dirname(os.path.abspath(__file__))

html_path = os.path.join(base_dir, "index.html")
css_path = os.path.join(base_dir, "src", "css", "index.css")
js_path = os.path.join(base_dir, "src", "js", "index.js")
analytics_js_path = os.path.join(base_dir, "src", "js", "analytics.js")

out_path = "/Users/giotub/Desktop/Automation_Learning_Hub.html"

# Verify all required resources exist before compiler launch
missing_files = []
for label, path in [("HTML", html_path), ("CSS", css_path), ("JS Core", js_path), ("Telemetry JS", analytics_js_path)]:
    if not os.path.exists(path):
        missing_files.append(f"{label} ({path})")

if missing_files:
    print("Error: The following required files are missing. Cannot compile:")
    for f in missing_files:
        print(f"  - {f}")
    exit(1)

# Read assets content
with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

with open(analytics_js_path, "r", encoding="utf-8") as f:
    analytics_js = f.read()

print("Resolving resource references and inlining compiled assets...")

# Replace <link rel="stylesheet" href="src/css/index.css"> with <style>...</style>
css_tag = f"<style>\n{css}\n</style>"
html = re.sub(r'<link[^>]*href=["\']src/css/index.css["\'][^>]*>', css_tag, html)

# Replace <script src="src/js/index.js" defer></script> with <script>...</script>
js_tag = f"<script>\n{js}\n</script>"
html = re.sub(r'<script[^>]*src=["\']src/js/index.js["\'][^>]*></script>', js_tag, html)

# Replace <script src="src/js/analytics.js" defer></script> with <script>...</script>
analytics_js_tag = f"<script>\n{analytics_js}\n</script>"
html = re.sub(r'<script[^>]*src=["\']src/js/analytics.js["\'][^>]*></script>', analytics_js_tag, html)

# Write out self-contained HTML file
with open(out_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Successfully created self-contained HTML on Desktop:", out_path)
