import requests
import os
import base64
from dotenv import load_dotenv

# repo 데이터 수집

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

headers = {
    "Authorization": f"Bearer { GITHUB_TOKEN}", # 인증된 신원조회를 하는 것
    "Accept": "application/vnd.github+json"
}

def get_repo_data(owner: str, repo: str):
    base_url= f"https://api.github.com/repos/{owner}/{repo}"

    # 세 개 동시에 요청 github api세 곳에서 http 요청을 보냄냄
    repo_info = requests.get(base_url, headers=headers).json()
    commits = requests.get(f"{base_url}/commits?per_page=20", headers=headers).json()
    readme_res = requests.get(f"{base_url}/readme", headers=headers).json()

    # README는 base64 인코딩되서 오니까 디코딩. 디코딩을 하지 않을 경우 알수없는 문자열로 나옴
    readme_text = ""
    if "content" in readme_res:
        readme_text = base64.b64decode(readme_res["content"]).decode("utf-8")
        readme_text = readme_text[:3000] # 토큰 절약

    return {
        "info": repo_info,
        "commits": commits,
        "readme": readme_text
    }