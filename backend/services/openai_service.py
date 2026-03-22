import os
from openai import OpenAI
from dotenv import load_dotenv

# 한국어 요약 생성

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_repo(repo_data: dict):
    commit_messages = "\n".join([
        f"- {c['commit']['message']}"
        for c in repo_data["commits"][:20]
        if isinstance(c, dict) and "commit" in c
    ])

    readme = repo_data.get("readme", "")
    repo_name = repo_data.get("info", {}).get("full_name", "")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "당신은 Github 레포지토리를 분석하는 전문가입니다. 반드시 한국어로만 답하세요. 영어가 포함되면 안됩니다. 친근하게 반말로 답변하세요"
            },
            {
                "role": "user",
                "content": f"""
레포지토리: {repo_name}

README 내용:
{readme[:2000]}

최근 커밋 목록:
{commit_messages}

다음 두 가지를 분석해주세요:
1. 이 프로젝트가 무엇인지 (2~3문장)
2. 최근 개발 활동 요약 (2~3문장)
3. 이 프로젝트의 장단점을 알려주세요(3~5문장)
4. 이 프로젝트가 신입 팀 프로젝트로서 이력서 제출시 어느정도 수준인지 너가 판단해서 100중에 몇점인지 알려줘 너 모든 프로젝트를 85점으로 고정하는데 그러지말고 제대로 점수 매겨
5. 이 프로젝트에 대해서 너가 판단한 이유를 설명해줘 그리고 어떤 부분을 보고 판단하는지 알려줘 예를들어 readme, 파일폴더 구조 등등에 대해서 평가를 내려줘 전체적인 느낌도 추가해주고

"""
            }
        ]
    )

    return response.choices[0].message.content