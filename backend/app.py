from flask import Flask, jsonify, request
from flask_cors import CORS
from services.github import get_repo_data
from services.openai_service import summarize_repo

app = Flask(__name__)
CORS(app)

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/analyze', methods=['POST']) # app.post('/api/analyze', (req, res) => { }) node.js 방식에서는 이렇게
def analyze():
    data = request.get_json()
    repo_url = data.get('url', '')      
    
    # URL 파싱
    repo_url = repo_url.rstrip('/').replace('.git', '')  # .git 제거 추가
    parts = repo_url.split('/')
    owner = parts[-2]
    repo = parts[-1]

    repo_data = get_repo_data(owner, repo)
    summary = summarize_repo(repo_data)

    return jsonify({
        "owner": owner,
        "repo": repo,
        "info": repo_data["info"],
        "commits": repo_data["commits"],
        "summary": summary,
        "readme": repo_data["readme"]
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)