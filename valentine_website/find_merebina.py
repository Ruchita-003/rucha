import urllib.request
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

# Try more specific patterns based on typical Bollywood Hungama URLs for wallpapers/first look
base_urls = [
    "https://stat{}.bollywoodhungama.in/wp-content/uploads/2016/03/Crook-{}.jpg",
    "https://stat{}.bollywoodhungama.in/wp-content/uploads/2016/03/Crook-Poster-{}.jpg",
    "https://stat{}.bollywoodhungama.in/wp-content/uploads/2010/10/Crook-{}.jpg",
    "https://stat{}.bollywoodhungama.in/wp-content/uploads/2010/10/Crook-First-Look-{}.jpg",
    "https://stat{}.bollywoodhungama.in/wp-content/uploads/2016/05/Crook-{}.jpg",
     "https://stat{}.bollywoodhungama.in/wp-content/uploads/2016/05/Crook-Poster-{}.jpg"
]

servers = range(1, 6)
indices = range(1, 15)

req_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

downloaded = False

for base in base_urls:
    if downloaded: break
    for s in servers:
        if downloaded: break
        for i in indices:
            url = base.format(s, i) # If base has one {}, format will work? No, base has 2.
            # Fix base format logic:
            try:
                actual_url = base.replace("{}", str(s), 1).replace("{}", str(i), 1)
                # print(f"Trying {actual_url}...")
                req = urllib.request.Request(actual_url, headers=req_headers)
                with urllib.request.urlopen(req, timeout=2) as response:
                    if response.status == 200:
                        content = response.read()
                        if len(content) > 5000: # Ensure valid image size
                            print(f"Found! Downloading {actual_url}...")
                            with open("assets/merebina.jpg", 'wb') as out_file:
                                out_file.write(content)
                            print("Success!")
                            downloaded = True
                            break
            except Exception:
                pass

if not downloaded:
    print("Could not find any Mere Bina/Crook image on Bollywood Hungama.")
