import urllib.request
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

# Use hqdefault.jpg as fallback if maxresdefault doesn't exist
images = [
    ("https://i.ytimg.com/vi/I3v7yC9D4xM/hqdefault.jpg", "assets/merebina.jpg"),
    ("https://i.ytimg.com/vi/v7KLjJX-3-A/hqdefault.jpg", "assets/okjaanu.jpg")
]

req_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

for url, filename in images:
    try:
        print(f"Downloading {url} to {filename}...")
        req = urllib.request.Request(url, headers=req_headers)
        with urllib.request.urlopen(req) as response, open(filename, 'wb') as out_file:
            out_file.write(response.read())
        print(f"Successfully downloaded {filename}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")
