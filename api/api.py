import ssl, OpenSSL
import json
import requests
from bs4 import BeautifulSoup as bs
import re
from flask import Flask

app = Flask(__name__)

HEADERS = {"User-Agent": "Mozilla/5.0 (X11; Linux i686; rv:13.0) Gecko/13.0 Firefox/13.0"}

def get_ssl(url):
    """
    Given the URL of a website, return a JSON representing:
    - If there is an SSL certificate present
    - If yes, who issued it
    - Cryptographic details about the certificate
    """
    cert = ssl.get_server_certificate((url, 443))
    x509 = OpenSSL.crypto.load_certificate(OpenSSL.crypto.FILETYPE_PEM, 
                                          cert)

    issuer = x509.get_issuer().get_components()
    issuer_dict = {key.decode('utf-8'): value.decode('utf-8') 
                   for (key, value) in dict(issuer).items()}
    not_after = x509.get_notAfter()
    not_before = x509.get_notBefore()
    alg = x509.get_signature_algorithm()
    
    return {"algorithm": str(alg, "utf-8"), 
            "not_after": str(not_after, "utf-8"),
            "not_before": str(not_before, "utf-8"),
            "issuer": issuer_dict}


def get_privacy_policy_link(url):
    """
    Get link to privacy policy by getting first DuckDuckGo result
    """
    r_page = requests.get("https://duckduckgo.com/html/?q=privacy policy site:{}".format(url), 
                          headers = HEADERS).text
    bs_page = bs(r_page, "lxml")
    return bs_page.find_all("a", attrs = {"class": "result__url"})[0].text.strip()


def find_emails(text):
    """ Find all emails present in a page"""
    return list(set(re.findall(r'[\w.+-]+@[^\W_]+[.-][A-Za-z0-9.-]+', text)))


def get_info(url):
    """
    Given a URL, return a JSON of information about it
    """
    ssl_details = get_ssl(url)
    policy_url = get_privacy_policy_link(url)

    if not(policy_url.startswith("http")):
        policy_url = "http://" + policy_url

    bs_page = bs(requests.get(policy_url, headers = HEADERS).text, "lxml")

    emails = find_emails(str(bs_page))
    
    return json.dumps({"url": url,
                       "ssl": ssl_details,
                       "privacy_policy_url": policy_url,
                       "contact_emails": emails,
                       "trackers": []})

@app.route("/api/v0/<url>")
def main(url):
    return get_info(url)
    

if __name__ == "__main__":
    app.run()
