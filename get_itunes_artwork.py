import urllib.request
import urllib.parse
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def get_artwork(query, filename):
    try:
        params = urllib.parse.urlencode({'term': query, 'media': 'music', 'entity': 'album', 'limit': 1})
        url = f"https://itunes.apple.com/search?{params}"
        print(f"Searching {url}...")
        
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            
        if data['resultCount'] > 0:
            result = data['results'][0]
            # Get high res url
            artwork_url = result['artworkUrl100'].replace('100x100bb', '1000x1000bb')
            print(f"Found artwork: {artwork_url}")
            
            with urllib.request.urlopen(artwork_url) as img_response, open(filename, 'wb') as f:
                f.write(img_response.read())
            print(f"Downloaded to {filename}")
            return True
        else:
            print(f"No results for {query}")
            return False
            
    except Exception as e:
        print(f"Error getting artwork for {query}: {e}")
        return False

# Search for Crook variations if first fails
if not get_artwork("Crook It's Good To Be Bad Soundtrack", "assets/merebina.jpg"):
    if not get_artwork("Crook Soundtrack", "assets/merebina.jpg"):
        get_artwork("Crook Pritam", "assets/merebina.jpg")
