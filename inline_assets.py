import os
import re
import base64

# Resolve base directories dynamically using the script's actual file path
base_dir = os.path.dirname(os.path.abspath(__file__))

css_path = os.path.join(base_dir, "src", "css", "index.css")
dashboard_css_path = os.path.join(base_dir, "src", "css", "dashboard.css")
js_path = os.path.join(base_dir, "src", "js", "index.js")
analytics_js_path = os.path.join(base_dir, "src", "js", "analytics.js")
dashboard_js_path = os.path.join(base_dir, "src", "js", "dashboard.js")
logo_path = os.path.join(base_dir, "aitruesight.png")

# Verify all required resources exist before compiler launch
missing_files = []
for label, path in [
    ("CSS Main", css_path),
    ("CSS Dashboard", dashboard_css_path),
    ("JS Core", js_path),
    ("Telemetry JS", analytics_js_path),
    ("Dashboard JS", dashboard_js_path),
    ("Logo Image", logo_path)
]:
    if not os.path.exists(path):
        missing_files.append(f"{label} ({path})")

if missing_files:
    print("Error: The following required files are missing. Cannot compile:")
    for f in missing_files:
        print(f"  - {f}")
    exit(1)

# Read shared asset contents
with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

with open(dashboard_css_path, "r", encoding="utf-8") as f:
    dashboard_css = f.read()

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

with open(analytics_js_path, "r", encoding="utf-8") as f:
    analytics_js = f.read()

with open(dashboard_js_path, "r", encoding="utf-8") as f:
    dashboard_js = f.read()

# Base64-encode the brand logo image to ensure 100% portability offline
with open(logo_path, "rb") as f:
    logo_data = f.read()
logo_base64 = base64.b64encode(logo_data).decode("utf-8")
logo_data_uri = f"data:image/png;base64,{logo_base64}"

def inline_file(input_file_path, output_file_path):
    print(f"Compiling {os.path.basename(input_file_path)}...")
    with open(input_file_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Replace logo image reference
    html = re.sub(r'src=["\']aitruesight\.png(?:\?v=\d+)?["\']', f'src="{logo_data_uri}"', html)
    html = re.sub(r'href=["\']aitruesight\.png(?:\?v=\d+)?["\']', f'href="{logo_data_uri}"', html)

    # Inline CSS
    css_tag = f"<style>\n{css}\n</style>"
    html = re.sub(r'<link[^>]*href=["\']src/css/index.css["\'][^>]*>', css_tag, html)

    dashboard_css_tag = f"<style>\n{dashboard_css}\n</style>"
    html = re.sub(r'<link[^>]*href=["\']src/css/dashboard.css["\'][^>]*>', dashboard_css_tag, html)

    # Inline JS Core
    js_tag = f"<script>\n{js}\n</script>"
    html = re.sub(r'<script[^>]*src=["\']src/js/index.js["\'][^>]*></script>', js_tag, html)

    # Inline Telemetry Analytics JS
    analytics_js_tag = f"<script>\n{analytics_js}\n</script>"
    html = re.sub(r'<script[^>]*src=["\']src/js/analytics.js["\'][^>]*></script>', analytics_js_tag, html)

    # Inline Dashboard JS (specifically for dashboard.html)
    if "dashboard.html" in input_file_path:
        dashboard_js_tag = f"<script>\n{dashboard_js}\n</script>"
        html = re.sub(r'<script[^>]*src=["\']src/js/dashboard.js["\'][^>]*></script>', dashboard_js_tag, html)

    # Update index links to point to the renamed offline portal build
    html = html.replace('href="index.html"', 'href="Automation_Learning_Hub.html"')

    with open(output_file_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Successfully compiled to: {output_file_path}")

# Pages map for offline generation
compilation_map = [
    ("index.html", "/Users/giotub/Desktop/Automation_Learning_Hub.html"),
    ("social-automation.html", "/Users/giotub/Desktop/social-automation.html"),
    ("web-development.html", "/Users/giotub/Desktop/web-development.html"),
    ("notebooklm-masterclass.html", "/Users/giotub/Desktop/notebooklm-masterclass.html"),
    ("dashboard.html", "/Users/giotub/Desktop/dashboard.html")
]

for src_name, dest_path in compilation_map:
    src_path = os.path.join(base_dir, src_name)
    if os.path.exists(src_path):
        inline_file(src_path, dest_path)
    else:
        print(f"Warning: Source file {src_name} not found in workspace, skipping compilation.")

print("All standalone pages compiled successfully!")
