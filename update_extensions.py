import requests
import os

def download_firefox(addon_slug):
    api_url = f"https://addons.mozilla.org/api/v5/addons/addon/{addon_slug}/versions/"
    response = requests.get(api_url).json()
    
    if not os.path.exists('firefox_versions'):
        os.makedirs('firefox_versions')

    for version in response.get('results', []):
        v_num = version['version']
        file_url = version['file']['url']
        print(f"Downloading Firefox version {v_num}...")
        r = requests.get(file_url)
        with open(f"firefox_versions/{addon_slug}_{v_num}.xpi", 'wb') as f:
            f.write(r.content)

def download_chrome_current(extension_id):
    if not os.path.exists('chrome_versions'):
        os.makedirs('chrome_versions')
    
    # Standard CRX download URL
    url = f"https://clients2.google.com/service/update2/crx?response=redirect&prodversion=98.0&acceptformat=crx2,crx3&x=id%3D{extension_id}%26uc"
    print(f"Downloading current Chrome version for {extension_id}...")
    r = requests.get(url)
    with open(f"chrome_versions/{extension_id}_current.crx", 'wb') as f:
        f.write(r.content)

if __name__ == "__main__":
    download_firefox("better-roblox-extension")
    download_chrome_current("lplhnhhlblehjmmkcpjbojiaanbpgnpd")
